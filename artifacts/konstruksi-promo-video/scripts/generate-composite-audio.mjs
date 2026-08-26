#!/usr/bin/env node
// Regenerates public/audio/composite_audio.mp3 from the raw audio stems
// (bg_music.mp3, vo_scene0..5.mp3, sfx_scene_transition.mp3) using the scene
// timing and mix levels declared in src/lib/video/config.ts.
//
// Run this any time SCENE_DURATIONS, scene order, or AUDIO_MIX_LEVELS
// change, so the composite mix never drifts from the video timeline:
//
//   node scripts/generate-composite-audio.mjs
//
// It has no build step and no dependency on the TS toolchain: config.ts is
// read as plain text and the two exported constants it needs
// (SCENE_DURATIONS, AUDIO_MIX_LEVELS) are extracted with a small, strict
// parser (parseNumberArray / parseLevelsObject below). If either constant's
// shape in config.ts changes in a way the parser can't handle, this script
// fails loudly instead of silently building a wrong mix.

import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ARTIFACT_DIR, 'src/lib/video/config.ts');
const AUDIO_DIR = path.join(ARTIFACT_DIR, 'public/audio');
const OUTPUT_PATH = path.join(AUDIO_DIR, 'composite_audio.mp3');
const MANIFEST_PATH = path.join(__dirname, 'composite-audio.manifest.json');
const SCENE_COUNT = 6;

function sha256File(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

/** Extracts `export const NAME = [ ...numbers... ];` as a number array. */
function parseNumberArray(source, constName) {
  const block = source.match(
    new RegExp(`export const ${constName}[^=]*=\\s*\\[([\\s\\S]*?)\\];`),
  );
  if (!block) fail(`Could not find "export const ${constName} = [...]" in config.ts`);
  const numbers = [...block[1].matchAll(/^\s*(\d+(?:\.\d+)?)\s*,/gm)].map((m) => Number(m[1]));
  if (numbers.length === 0) fail(`Parsed zero entries from ${constName} in config.ts`);
  return numbers;
}

/** Extracts `export const NAME = { key: number, ... } as const;` as an object. */
function parseLevelsObject(source, constName) {
  const block = source.match(
    new RegExp(`export const ${constName}[^=]*=\\s*\\{([\\s\\S]*?)\\}\\s*as const;`),
  );
  if (!block) fail(`Could not find "export const ${constName} = {...} as const" in config.ts`);
  const levels = {};
  for (const m of block[1].matchAll(/(\w+)\s*:\s*([\d.]+)\s*,?/g)) {
    levels[m[1]] = Number(m[2]);
  }
  if (Object.keys(levels).length === 0) fail(`Parsed zero entries from ${constName} in config.ts`);
  return levels;
}

function requireFile(filePath, label) {
  if (!existsSync(filePath)) fail(`Missing ${label}: ${filePath}`);
  return filePath;
}

function ffprobeDurationSec(filePath) {
  const result = spawnSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    filePath,
  ]);
  if (result.status !== 0) fail(`ffprobe failed on ${filePath}: ${result.stderr}`);
  return Number(result.stdout.toString().trim());
}

// ---------------------------------------------------------------------------
// 1. Read scene timing + mix levels from config.ts (single source of truth).
// ---------------------------------------------------------------------------
const configSrc = readFileSync(CONFIG_PATH, 'utf8');
const sceneDurationsMs = parseNumberArray(configSrc, 'SCENE_DURATIONS');
const levels = parseLevelsObject(configSrc, 'AUDIO_MIX_LEVELS');

if (sceneDurationsMs.length !== SCENE_COUNT) {
  fail(
    `Expected ${SCENE_COUNT} scenes in SCENE_DURATIONS, found ${sceneDurationsMs.length}. ` +
      `Update SCENE_COUNT and the vo_scene*/sfx wiring below if the video's scene count changed.`,
  );
}
for (const key of ['music', 'voiceover', 'transitionSfx']) {
  if (typeof levels[key] !== 'number') fail(`AUDIO_MIX_LEVELS.${key} missing or not a number`);
}

const sceneStartMs = [];
{
  let cumulative = 0;
  for (const ms of sceneDurationsMs) {
    sceneStartMs.push(cumulative);
    cumulative += ms;
  }
}
const totalMs = sceneDurationsMs.reduce((a, b) => a + b, 0);
const totalSec = (totalMs / 1000).toFixed(3);

console.log(`Scene durations (ms): ${sceneDurationsMs.join(', ')}`);
console.log(`Scene starts (ms):    ${sceneStartMs.join(', ')}`);
console.log(`Total duration:       ${totalSec}s`);
console.log(`Mix levels:           music=${levels.music} voiceover=${levels.voiceover} transitionSfx=${levels.transitionSfx}`);

// ---------------------------------------------------------------------------
// 2. Locate stems.
// ---------------------------------------------------------------------------
const musicPath = requireFile(path.join(AUDIO_DIR, 'bg_music.mp3'), 'background music');
const sfxPath = requireFile(path.join(AUDIO_DIR, 'sfx_scene_transition.mp3'), 'transition SFX');
const voPaths = sceneDurationsMs.map((_, i) =>
  requireFile(path.join(AUDIO_DIR, `vo_scene${i}.mp3`), `voiceover for scene ${i}`),
);

// ---------------------------------------------------------------------------
// 3. Build the ffmpeg filtergraph.
//
// Inputs:
//   0            bg_music.mp3       — looped so it always covers totalSec,
//                                      even if scenes get longer later.
//   1..6         vo_scene0..5.mp3   — one narration track per scene,
//                                      delayed to that scene's start time.
//   7..(6+N)     sfx_scene_transition.mp3, once per scene start — this is
//                                      the "cue at every scene boundary"
//                                      (scene 0's start counts as the
//                                      opening cue, so N scenes -> N cues).
//
// All streams are mixed with amix (duration=first, keyed off the
// music bed which is pre-trimmed to totalSec), then a limiter guards
// against clipping when cues overlap the voiceover. `-t totalSec` is a
// hard stop so the output can never run longer than the video.
// ---------------------------------------------------------------------------
const inputArgs = [
  '-stream_loop', '-1', '-i', musicPath,
  ...voPaths.flatMap((p) => ['-i', p]),
  ...sceneStartMs.flatMap(() => ['-i', sfxPath]),
];

const voInputOffset = 1;
const sfxInputOffset = 1 + voPaths.length;

const filters = [];
filters.push(`[0:a]atrim=0:${totalSec},asetpts=PTS-STARTPTS,volume=${levels.music}[music]`);
sceneStartMs.forEach((startMs, i) => {
  // Hard-trim narration to its own scene's duration so a voiceover longer
  // than its scene (mastered without knowledge of the current timeline)
  // cannot bleed into the next scene's cue/narration.
  const sceneDurSec = (sceneDurationsMs[i] / 1000).toFixed(3);
  filters.push(
    `[${voInputOffset + i}:a]atrim=0:${sceneDurSec},asetpts=PTS-STARTPTS,adelay=${startMs}|${startMs},volume=${levels.voiceover}[vo${i}]`,
  );
});
sceneStartMs.forEach((startMs, i) => {
  filters.push(
    `[${sfxInputOffset + i}:a]adelay=${startMs}|${startMs},volume=${levels.transitionSfx}[sfx${i}]`,
  );
});
const mixLabels = [
  '[music]',
  ...sceneStartMs.map((_, i) => `[vo${i}]`),
  ...sceneStartMs.map((_, i) => `[sfx${i}]`),
].join('');
const totalStreams = 1 + sceneStartMs.length * 2;
filters.push(`${mixLabels}amix=inputs=${totalStreams}:duration=first:normalize=0[premix]`);
filters.push(`[premix]alimiter=limit=0.95[mixed]`);

const ffmpegArgs = [
  '-y',
  ...inputArgs,
  '-filter_complex', filters.join(';'),
  '-map', '[mixed]',
  '-t', totalSec,
  '-ar', '44100',
  '-ac', '2',
  '-b:a', '192k',
  OUTPUT_PATH,
];

console.log('\nRunning ffmpeg...');
const result = spawnSync('ffmpeg', ffmpegArgs, { stdio: 'inherit' });
if (result.status !== 0) fail('ffmpeg exited with an error (see output above).');

const outputDurationSec = ffprobeDurationSec(OUTPUT_PATH);
console.log(`\nWrote ${OUTPUT_PATH}`);
console.log(`Output duration: ${outputDurationSec.toFixed(3)}s (target ${totalSec}s)`);

// ---------------------------------------------------------------------------
// 4. Write a manifest fingerprinting the exact inputs this mix was built
// from (scene durations, mix levels, and a hash of every raw stem file).
// validate-composite-audio.mjs recomputes this same fingerprint from the
// *current* config.ts/stems and fails the build the instant any of them
// changes without a regeneration — a deterministic check that doesn't rely
// on guessing what the mixed audio should sound like.
// ---------------------------------------------------------------------------
const manifest = {
  sceneDurationsMs,
  mixLevels: levels,
  stems: {
    'bg_music.mp3': sha256File(musicPath),
    'sfx_scene_transition.mp3': sha256File(sfxPath),
    ...Object.fromEntries(voPaths.map((p, i) => [`vo_scene${i}.mp3`, sha256File(p)])),
  },
};
writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${MANIFEST_PATH}`);
console.log('\nRun `node scripts/validate-composite-audio.mjs` to verify sync.');
