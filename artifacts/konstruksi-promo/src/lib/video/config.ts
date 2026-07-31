export const SCENE_DURATIONS = [
  3500,  // Scene 0: Hero intro - KonstruksiAI
  4500,  // Scene 1: Problem statement
  5500,  // Scene 2: 6 Domain showcase
  5000,  // Scene 3: Key features (multi-agent, certs, tender)
  4500,  // Scene 4: Document upload feature
  3500,  // Scene 5: Outro/CTA
];

export const TOTAL_DURATION = SCENE_DURATIONS.reduce((a, b) => a + b, 0);
