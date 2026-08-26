import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video/hooks';
import {
  SCENE_DURATIONS,
  SCENE_DURATIONS_RECORD,
  SCENE_SUBTITLES,
} from '@/lib/video/config';
import { Scene0 } from './video_scenes/Scene0';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

const scenes = [Scene0, Scene1, Scene2, Scene3, Scene4, Scene5];

// Canonical scene start times derived from the unrotated durations array
const SCENE_START_SEC: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let cumulativeMs = 0;
  SCENE_DURATIONS.forEach((ms, i) => {
    out[`scene${i}`] = cumulativeMs / 1000;
    cumulativeMs += ms;
  });
  return out;
})();

const AUDIO_SEEK_EPSILON_SEC = 0.18;

export default function VideoTemplate({
  durations = SCENE_DURATIONS_RECORD,
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
  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '');

  // Resolve the rendered scene from the LOGICAL scene key (e.g. "scene3"), not
  // from the hook's local position index. When durations are rotated or locked
  // (scene-jump / loop-current-scene controls in preview mode), `currentScene`
  // is only a position within the rotated sequence -- using it directly against
  // the fixed `scenes` array would show a different scene than the subtitle/
  // audio, which stay keyed off `currentSceneKey`. Falling back to `currentScene`
  // keeps this safe even if the key format ever changes.
  const sceneIndexFromKey = Number(baseSceneKey.replace('scene', ''));
  const SceneComponent =
    scenes[Number.isInteger(sceneIndexFromKey) ? sceneIndexFromKey : currentScene] ??
    scenes[currentScene];

  // Notify parent of scene changes
  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  // Seek audio to the correct scene start time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    const targetTime = SCENE_START_SEC[baseSceneKey] ?? 0;
    if (Math.abs(audio.currentTime - targetTime) > AUDIO_SEEK_EPSILON_SEC) {
      audio.currentTime = targetTime;
    }
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey, muted]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 noise-texture">
      <AnimatePresence mode="popLayout">
        <SceneComponent key={currentScene} />
      </AnimatePresence>

      <AnimatePresence mode="sync">
        <motion.div
          key={baseSceneKey}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{
            opacity: { duration: 0.28, ease: 'easeOut' },
            y: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
          }}
          className="pointer-events-none absolute inset-x-0 bottom-[10%] z-40 flex justify-center px-6 sm:px-10"
          aria-live="polite"
          aria-label="Subtitle"
        >
          <span className="max-w-[min(86vw,54rem)] rounded-lg border border-white/15 bg-slate-950/80 px-5 py-3 text-center font-body text-sm font-medium leading-relaxed tracking-wide text-white shadow-[0_8px_30px_rgba(2,6,23,0.45)] backdrop-blur-sm sm:px-7 sm:py-3.5 sm:text-base">
            {SCENE_SUBTITLES[Number(baseSceneKey.replace('scene', ''))] ?? ''}
          </span>
        </motion.div>
      </AnimatePresence>

      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/composite_audio.mp3`}
        preload="auto"
        autoPlay
        muted={muted}
      />
    </div>
  );
}

// Named export for backward compat
export { VideoTemplate };
