import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1600),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-orange-950 to-slate-950">
      {/* Radial gradient center */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.2) 0%, transparent 70%)'
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-25" />

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-orange-500/20 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ delay: 0.3, duration: 1.2 }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-orange-400/30 rotate-45"
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{ scale: 1, opacity: 0.3, rotate: 45 }}
        transition={{ delay: 0.5, duration: 1 }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-[6vw] text-center">
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.7, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl glow-orange">
            <span className="text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>K</span>
          </div>
        </motion.div>

        {/* Main CTA headline */}
        <motion.h1
          className="mb-6"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 10vw, 6rem)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.02em'
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-white">Bangun</span>
          <br />
          <span className="text-gradient-orange">Lebih Cerdas</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-slate-300 mb-12 max-w-2xl"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2.2vw, 1.4rem)',
            fontWeight: 500,
            lineHeight: 1.5
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          AI yang dirancang khusus untuk profesional
          <br />
          konstruksi dan teknik di Indonesia
        </motion.p>

        {/* Brand lockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <h2
            className="text-gradient-orange"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.01em'
            }}
          >
            KonstruksiAI
          </h2>
        </motion.div>

        {/* Bottom accent lines */}
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={phase >= 3 ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="w-20 h-0.5 bg-orange-500" />
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <div className="w-20 h-0.5 bg-orange-500" />
        </motion.div>
      </div>

      {/* Exit animation - fade to logo before loop */}
      <motion.div
        className="absolute inset-0 bg-slate-950 flex items-center justify-center"
        initial={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <motion.div
          initial={{ scale: 1, opacity: 0 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center"
        >
          <span className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>K</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
