import { useEffect, useRef } from 'react';
import { useVideoPlayer } from '@/lib/video';
import { AnimatePresence, motion } from 'framer-motion';

import { Scene0Intro } from './video_scenes/Scene0Intro';
import { Scene1Chat } from './video_scenes/Scene1Chat';
import { Scene2SBU } from './video_scenes/Scene2SBU';
import { Scene3Tender } from './video_scenes/Scene3Tender';
import { Scene4Agents } from './video_scenes/Scene4Agents';
import { Scene5Outro } from './video_scenes/Scene5Outro';

export const SCENE_DURATIONS: Record<string, number> = {
  intro: 4500,
  chat: 8000,
  sbu: 7000,
  tender: 7500,
  agents: 7000,
  outro: 6000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  intro: Scene0Intro,
  chat: Scene1Chat,
  sbu: Scene2SBU,
  tender: Scene3Tender,
  agents: Scene4Agents,
  outro: Scene5Outro,
};

const SCENE_START_SEC: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let cumulativeMs = 0;
  for (const [key, ms] of Object.entries(SCENE_DURATIONS)) {
    out[key] = cumulativeMs / 1000;
    cumulativeMs += ms;
  }
  return out;
})();

const AUDIO_SEEK_EPSILON_SEC = 0.18;

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '');
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    const targetTime = SCENE_START_SEC[baseSceneKey] ?? 0;
    if (Math.abs(audio.currentTime - targetTime) > AUDIO_SEEK_EPSILON_SEC) {
      audio.currentTime = targetTime;
    }
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey]);

  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <>
      <div
        className="w-full h-screen overflow-hidden relative"
        style={{ backgroundColor: 'var(--color-bg-base)' }}
      >
        {/* Persistent Background Layer */}
        <div className="absolute inset-0 z-0">
          {/* Dynamic Image Background */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            animate={{
              backgroundImage:
                sceneIndex === 0 ? `url(${import.meta.env.BASE_URL}images/bg-blueprint.jpg)` :
                sceneIndex === 3 ? `url(${import.meta.env.BASE_URL}images/bg-data.jpg)` :
                sceneIndex === 4 ? `url(${import.meta.env.BASE_URL}images/bg-nodes.jpg)` :
                `url(${import.meta.env.BASE_URL}images/bg-blueprint.jpg)`,
              scale: sceneIndex === 0 ? 1.1 : 1.05,
            }}
            transition={{ duration: 2 }}
          />

          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/40 mix-blend-multiply" />

          {/* Persistent Floating Orb */}
          <motion.div
            className="absolute w-[40vw] h-[40vw] rounded-full blur-[100px] pointer-events-none mix-blend-screen"
            animate={{
              x: sceneIndex === 0 ? '50vw' : sceneIndex === 1 ? '10vw' : sceneIndex === 3 ? '60vw' : '30vw',
              y: sceneIndex === 0 ? '20vh' : sceneIndex === 2 ? '50vh' : '10vh',
              backgroundColor: sceneIndex === 3 ? 'rgba(255,100,0,0.1)' : 'rgba(255,160,0,0.05)',
              scale: sceneIndex === 4 ? 1.5 : 1,
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>

        {/* mode="sync" to overlap scene exits/enters */}
        <AnimatePresence mode="sync">
          {SceneComponent && <SceneComponent key={currentSceneKey} />}
        </AnimatePresence>
      </div>

      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/bg_music.mp3`}
        preload="auto"
        autoPlay
        muted={muted}
      />
    </>
  );
}
