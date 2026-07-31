import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1700),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      {/* Radial gradient accent */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 70% 40%, rgba(249, 115, 22, 0.12) 0%, transparent 60%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-15" />

      {/* Content split layout */}
      <div className="relative z-10 grid grid-cols-2 gap-12 h-full items-center px-[8vw]">
        {/* Left side - Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-16 h-1 bg-orange-500 mb-6" />
            <h2
              className="text-white mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.02em'
              }}
            >
              Upload & Analisis
              <br />
              <span className="text-gradient-orange">Dokumen Anda</span>
            </h2>
          </motion.div>

          <motion.p
            className="text-slate-400 mb-8"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)',
              fontWeight: 500,
              lineHeight: 1.6
            }}
            initial={{ opacity: 0, x: -40 }}
            animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Unggah PDF teknis, tender, atau spesifikasi —
            AI akan menganalisis dan memberikan insight mendalam
          </motion.p>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {['Ekstraksi data otomatis', 'Identifikasi risiko', 'Rekomendasi ahli'].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -30 }}
                animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{
                  delay: 0.5 + i * 0.1,
                  duration: 0.5
                }}
              >
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                <span
                  className="text-slate-300"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                    fontWeight: 500
                  }}
                >
                  {item}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right side - Document mockup */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={phase >= 2 ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 60, scale: 0.9 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Document card */}
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8 shadow-2xl">
            {/* Document header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="h-3 bg-slate-700 rounded w-3/4 mb-2" />
                <div className="h-2 bg-slate-800 rounded w-1/2" />
              </div>
            </div>

            {/* Document content lines */}
            <div className="space-y-2.5">
              {[100, 85, 95, 70, 90, 80].map((width, i) => (
                <motion.div
                  key={i}
                  className="h-2 bg-slate-700 rounded"
                  style={{ width: `${width}%` }}
                  initial={{ scaleX: 0, transformOrigin: 'left' }}
                  animate={phase >= 3 ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{
                    delay: 0.6 + i * 0.05,
                    duration: 0.4
                  }}
                />
              ))}
            </div>

            {/* AI analysis badge */}
            <motion.div
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/40 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span
                className="text-orange-300"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
                  fontWeight: 600
                }}
              >
                AI sedang menganalisis...
              </span>
            </motion.div>
          </div>

          {/* Floating accent circle */}
          <motion.div
            className="absolute -top-8 -right-8 w-32 h-32 border-2 border-orange-500/30 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
        </motion.div>
      </div>

      {/* Exit transition */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-500"
        initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
        exit={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
