import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene0() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated grid background */}
      <motion.div
        className="absolute inset-0 grid-pattern opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
      />

      {/* Floating geometric accents */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 border-2 border-orange-500/20 rotate-45"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 45 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute bottom-32 left-16 w-24 h-24 border-2 border-orange-400/30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Orange accent line that draws across */}
      <motion.div
        className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent"
        initial={{ width: 0, x: '0%' }}
        animate={{ width: '100%', x: '0%' }}
        transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Logo/Brand mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-2xl">
            <span className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>K</span>
          </div>
        </motion.div>

        {/* Main title */}
        <motion.h1
          className="text-gradient-orange mb-4"
          style={{ 
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 12vw, 8rem)',
            fontWeight: 800,
            lineHeight: 0.9,
            letterSpacing: '-0.02em'
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          KonstruksiAI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-slate-400 text-center max-w-2xl px-8"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            fontWeight: 500,
            letterSpacing: '0.01em'
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Asisten AI untuk Industri Konstruksi & Teknik Indonesia
        </motion.p>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-1 bg-orange-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        />
      </div>

      {/* Exit animation - zoom out elements */}
      <motion.div
        className="absolute inset-0 bg-slate-950"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}
