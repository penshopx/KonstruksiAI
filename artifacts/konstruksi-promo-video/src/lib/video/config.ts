export const SCENE_DURATIONS = [
  3500,  // Scene 0: Hero intro - KonstruksiAI
  4500,  // Scene 1: Problem statement
  5500,  // Scene 2: 6 Domain showcase
  5000,  // Scene 3: Key features (multi-agent, certs, tender)
  4500,  // Scene 4: Document upload feature
  3500,  // Scene 5: Outro/CTA
];

export const TOTAL_DURATION = SCENE_DURATIONS.reduce((a, b) => a + b, 0);

// Cumulative start time (ms) of each scene. This is the single source of
// truth for "scene boundaries" — used by the player to seek
// composite_audio.mp3 during playback, and by
// scripts/generate-composite-audio.mjs to place the voiceover and
// scene-transition SFX cues when the audio mix is regenerated.
export const SCENE_START_MS: number[] = (() => {
  const starts: number[] = [];
  let cumulative = 0;
  for (const ms of SCENE_DURATIONS) {
    starts.push(cumulative);
    cumulative += ms;
  }
  return starts;
})();

// Audio mix levels consumed by scripts/generate-composite-audio.mjs when it
// (re)builds public/audio/composite_audio.mp3 from bg_music.mp3, the
// vo_scene*.mp3 narration tracks, and sfx_scene_transition.mp3.
// Each value is an ffmpeg `volume` filter gain multiplier (1.0 = unity).
// Adjust these and rerun `node scripts/generate-composite-audio.mjs` —
// never hand-edit composite_audio.mp3 directly, or it will drift from
// SCENE_DURATIONS the next time a scene length changes.
export const AUDIO_MIX_LEVELS = {
  music: 0.35, // background bed, ducked well under the voiceover
  voiceover: 1.0, // narration tracks, already mastered at unity gain
  transitionSfx: 0.8, // scene-change cue, audible but not overpowering
} as const;

// Record form — keys are scene0..scene5
export const SCENE_DURATIONS_RECORD: Record<string, number> = SCENE_DURATIONS.reduce(
  (acc, ms, i) => ({ ...acc, [`scene${i}`]: ms }),
  {} as Record<string, number>,
);

// Bahasa Indonesia narration used by the matching vo_scene*.mp3 tracks.
// Keeping the copy beside the scene timing prevents the preview and export
// compositions from drifting apart.
export const SCENE_SUBTITLES = [
  'KonstruksiAI — asisten AI proyek konstruksi.',
  'Proyek terlambat, anggaran membengkak — masalah nyata.',
  'Enam domain keahlian, satu platform terintegrasi.',
  'Multi-agen, sertifikasi, dan analisis tender.',
  'Unggah dokumen, dapatkan analisis instan.',
  'Bangun lebih cerdas bersama KonstruksiAI.',
] as const;
