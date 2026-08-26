#!/usr/bin/env node
// Verifies that public/audio/composite_audio.mp3 is in sync with the scene
// timeline declared in src/lib/video/config.ts. Run after every
// `node scripts/generate-composite-audio.mjs`, and any time SCENE_DURATIONS
// changes, to catch a stale composite mix before it ships:
//
//   node scripts/validate-composite-audio.mjs
//
// Checks:
//   1. (Deterministic, authoritative) composite_audio.mp3 was actually built
//      from the SCENE_DURATIONS, AUDIO_MIX_LEVELS, and raw audio stems
//      currently on disk — verified against the fingerprint manifest that
//      generate-composite-audio.mjs writes alongside the mix
//      (scripts/composite-audio.manifest.json). Any edit to scene timing,
//      mix levels, or a stem file changes the fingerprint and fails this
//      check immediately, regardless of what the resulting audio happens to
//      sound like.
//   2. composite_audio.mp3 duration matches TOTAL_DURATION (the video
//      runtime) within a small tolerance — it must not run long or stop
//      short of the video.
//   3. There is an audible cue (the transition SFX layered on top of the
//      music bed) at every one of the 6 scene-boundary timestamps
//      (SCENE_START_MS from config.ts) — a sanity check on top of (1) that
//      the mix itself, not just its inputs, is correct.
//
// Exit 0 = in sync, exit 1 = drifted (regenerate with generate-composite-audio.mjs).

import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ARTIFACT_DIR, 'src/lib/video/config.ts');
const AUDIO_DIR = path.join(ARTIFACT_DIR, 'public/audio');
const COMPOSITE_PATH = path.join(AUDIO_DIR, 'composite_audio.mp3');
const MANIFEST_PATH = path.join(__dirname, 'composite-audio.manifest.json');
const SCENE_COUNT = 6;

function sha256File(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

// Tolerances tuned against the shipped mix (see generate-composite-audio.mjs).
const DURATION_TOLERANCE_SEC = 0.15;
const CUE_WINDOW_SEC = 0.9; // >= sfx_scene_transition.mp3 duration (~1.04s at ffmpeg's atrim it's trimmed to this window)
const CUE_BASELINE_OFFSET_SEC = 1.6; // sampled after the cue window, still inside the same scene
const CUE_MIN_DELTA_DB = 1.5; // cue window must be at least this much louder than baseline

let errors = 0;
function fail(message) {
  console.error(`ERROR: ${message}`);
  errors += 1;
}

function parseNumberArray(source, constName) {
  const block = source.match(
    new RegExp(`export const ${constName}[^=]*=\\s*\\[([\\s\\S]*?)\\];`),
  );
  if (!block) return null;
  return [...block[1].matchAll(/^\s*(\d+(?:\.\d+)?)\s*,/gm)].map((m) => Number(m[1]));
}

function parseLevelsObject(source, constName) {
  const block = source.match(
    new RegExp(`export const ${constName}[^=]*=\\s*\\{([\\s\\S]*?)\\}\\s*as const;`),
  );
  if (!block) return null;
  const levels = {};
  for (const m of block[1].matchAll(/(\w+)\s*:\s*([\d.]+)\s*,?/g)) {
    levels[m[1]] = Number(m[2]);
  }
  return Object.keys(levels).length > 0 ? levels : null;
}

function ffprobeDurationSec(filePath) {
  const result = spawnSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    filePath,
  ]);
  if (result.status !== 0) return null;
  const value = Number(result.stdout.toString().trim());
  return Number.isFinite(value) ? value : null;
}

/** Mean volume (dBFS) of composite_audio.mp3 over [startSec, startSec+lenSec]. */
function meanVolumeDb(filePath, startSec, lenSec) {
  const result = spawnSync('ffmpeg', [
    '-ss', String(Math.max(startSec, 0)),
    '-t', String(lenSec),
    '-i', filePath,
    '-af', 'volumedetect',
    '-f', 'null',
    '-',
  ]);
  const stderr = result.stderr.toString();
  const match = stderr.match(/mean_volume:\s*(-?\d+(?:\.\d+)?)\s*dB/);
  return match ? Number(match[1]) : null;
}

if (!existsSync(CONFIG_PATH)) {
  fail(`config.ts not found at ${CONFIG_PATH}`);
  process.exit(1);
}
if (!existsSync(COMPOSITE_PATH)) {
  fail(`composite_audio.mp3 not found at ${COMPOSITE_PATH}. Run generate-composite-audio.mjs first.`);
  process.exit(1);
}

const configSrc = readFileSync(CONFIG_PATH, 'utf8');
const sceneDurationsMs = parseNumberArray(configSrc, 'SCENE_DURATIONS');
if (!sceneDurationsMs || sceneDurationsMs.length === 0) {
  fail('Could not parse SCENE_DURATIONS from config.ts');
  process.exit(1);
}
if (sceneDurationsMs.length !== SCENE_COUNT) {
  fail(
    `Expected ${SCENE_COUNT} scenes in SCENE_DURATIONS, found ${sceneDurationsMs.length}. ` +
      `Update SCENE_COUNT in this script and in generate-composite-audio.mjs if the scene count changed.`,
  );
}
const mixLevels = parseLevelsObject(configSrc, 'AUDIO_MIX_LEVELS');
if (!mixLevels) {
  fail('Could not parse AUDIO_MIX_LEVELS from config.ts');
  process.exit(1);
}

const sceneStartMs = [];
{
  let cumulative = 0;
  for (const ms of sceneDurationsMs) {
    sceneStartMs.push(cumulative);
    cumulative += ms;
  }
}
const totalSec = sceneDurationsMs.reduce((a, b) => a + b, 0) / 1000;

// ---------------------------------------------------------------------------
// Check 1 (authoritative): composite_audio.mp3 was generated from exactly
// the SCENE_DURATIONS, AUDIO_MIX_LEVELS, and stem files currently on disk.
// This is deterministic — it cannot be fooled by an edit that happens to
// preserve total runtime or by audio that happens to sound plausible.
// ---------------------------------------------------------------------------
if (!existsSync(MANIFEST_PATH)) {
  fail(
    `${MANIFEST_PATH} not found. composite_audio.mp3 was not built by ` +
      `generate-composite-audio.mjs (or the manifest was deleted). Run ` +
      `node scripts/generate-composite-audio.mjs.`,
  );
} else {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));

  if (JSON.stringify(manifest.sceneDurationsMs) !== JSON.stringify(sceneDurationsMs)) {
    fail(
      `SCENE_DURATIONS changed since composite_audio.mp3 was generated ` +
        `(manifest: [${manifest.sceneDurationsMs}], config.ts: [${sceneDurationsMs}]). ` +
        `Regenerate with node scripts/generate-composite-audio.mjs.`,
    );
  }
  for (const key of ['music', 'voiceover', 'transitionSfx']) {
    if (manifest.mixLevels?.[key] !== mixLevels[key]) {
      fail(
        `AUDIO_MIX_LEVELS.${key} changed since composite_audio.mp3 was generated ` +
          `(manifest: ${manifest.mixLevels?.[key]}, config.ts: ${mixLevels[key]}). ` +
          `Regenerate with node scripts/generate-composite-audio.mjs.`,
      );
    }
  }

  const stemFiles = [
    'bg_music.mp3',
    'sfx_scene_transition.mp3',
    ...sceneDurationsMs.map((_, i) => `vo_scene${i}.mp3`),
  ];
  for (const filename of stemFiles) {
    const stemPath = path.join(AUDIO_DIR, filename);
    if (!existsSync(stemPath)) {
      fail(`Stem file ${filename} referenced by the manifest is missing from ${AUDIO_DIR}.`);
      continue;
    }
    const currentHash = sha256File(stemPath);
    const manifestHash = manifest.stems?.[filename];
    if (currentHash !== manifestHash) {
      fail(
        `${filename} changed since composite_audio.mp3 was generated. ` +
          `Regenerate with node scripts/generate-composite-audio.mjs.`,
      );
    }
  }

  if (errors === 0) {
    console.log('Manifest fingerprint matches config.ts and all audio stems.');
  }
}

// ---------------------------------------------------------------------------
// Check 2: output stops at the video's runtime.
// ---------------------------------------------------------------------------
const actualDurationSec = ffprobeDurationSec(COMPOSITE_PATH);
if (actualDurationSec === null) {
  fail('Could not read composite_audio.mp3 duration via ffprobe.');
} else {
  const delta = Math.abs(actualDurationSec - totalSec);
  console.log(
    `Duration: ${actualDurationSec.toFixed(3)}s vs video runtime ${totalSec.toFixed(3)}s ` +
      `(delta ${delta.toFixed(3)}s, tolerance ${DURATION_TOLERANCE_SEC}s)`,
  );
  if (delta > DURATION_TOLERANCE_SEC) {
    fail(
      `composite_audio.mp3 duration (${actualDurationSec.toFixed(3)}s) does not match the video ` +
        `runtime (${totalSec.toFixed(3)}s from SCENE_DURATIONS). Regenerate with ` +
        `node scripts/generate-composite-audio.mjs.`,
    );
  }
}

// ---------------------------------------------------------------------------
// Check 3: an audible cue exists at every scene boundary.
// ---------------------------------------------------------------------------
console.log('\nChecking transition cue at each scene boundary:');
sceneStartMs.forEach((startMs, i) => {
  const startSec = startMs / 1000;
  const cueDb = meanVolumeDb(COMPOSITE_PATH, startSec, CUE_WINDOW_SEC);
  const baselineSec = startSec + CUE_BASELINE_OFFSET_SEC;
  const baselineDb = meanVolumeDb(COMPOSITE_PATH, baselineSec, CUE_WINDOW_SEC);

  if (cueDb === null || baselineDb === null) {
    fail(`scene${i} (t=${startSec.toFixed(2)}s): could not measure volume (ffmpeg/volumedetect failed).`);
    return;
  }
  const delta = cueDb - baselineDb;
  const status = delta >= CUE_MIN_DELTA_DB ? 'OK' : 'MISSING';
  console.log(
    `  scene${i} @ ${startSec.toFixed(2)}s: cue=${cueDb.toFixed(1)}dB baseline=${baselineDb.toFixed(1)}dB ` +
      `delta=${delta.toFixed(1)}dB [${status}]`,
  );
  if (delta < CUE_MIN_DELTA_DB) {
    fail(
      `No audible transition cue detected at scene${i}'s boundary (t=${startSec.toFixed(2)}s). ` +
        `Regenerate with node scripts/generate-composite-audio.mjs.`,
    );
  }
});

console.log('');
if (errors > 0) {
  console.error(`${errors} check(s) failed. composite_audio.mp3 is out of sync with config.ts.`);
  process.exit(1);
}
console.log('composite_audio.mp3 is in sync with SCENE_DURATIONS: duration and all 6 scene cues check out.');
process.exit(0);
