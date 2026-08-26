export const SCENE_DURATIONS = [
  3500,  // Scene 0: Hero intro - KonstruksiAI
  4500,  // Scene 1: Problem statement
  5500,  // Scene 2: 6 Domain showcase
  5000,  // Scene 3: Key features (multi-agent, certs, tender)
  4500,  // Scene 4: Document upload feature
  3500,  // Scene 5: Outro/CTA
];

export const TOTAL_DURATION = SCENE_DURATIONS.reduce((a, b) => a + b, 0);

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
