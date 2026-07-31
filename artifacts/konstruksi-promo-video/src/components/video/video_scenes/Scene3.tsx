import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const features = [
    {
      title: 'Multi-Agent Specialists',
      desc: 'Estimator RAB, K3 Safety, Tender Expert, dan lebih',
      highlight: 'Estimator RAB'
    },
    {
      title: 'Sertifikasi SBU & SKK',
      desc: 'Panduan lengkap untuk lisensi konstruksi Indonesia',
      highlight: 'SBU & SKK'
    },
    {
      title: 'Analisis Tender LPSE',
      desc: 'AI menganalisis dokumen e-procurement otomatis',
      highlight: 'LPSE'
    }
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Diagonal accent stripe */}
      <motion.div
        className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-orange-900/20 to-transparent"
        initial={{ x: '100%' }}
        animate={{ x: '0%' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-24 h-24 border border-orange-500/20 rounded-lg rotate-12"
        initial={{ opacity: 0, scale: 0, rotate: 0 }}
        animate={{ opacity: 0.4, scale: 1, rotate: 12 }}
        transition={{ delay: 0.4, duration: 1 }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-orange-500/10 rounded-full"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-[8vw]">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, x: -50 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="text-white mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}
          >
            Fitur <span className="text-gradient-orange">Powerful</span>
          </h2>
          <div className="w-24 h-1 bg-orange-500 mt-4" />
        </motion.div>

        {/* Feature cards */}
        <div className="space-y-6 max-w-3xl">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="relative group"
              initial={{ opacity: 0, x: -60 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
              transition={{
                delay: i * 0.15,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <div className="relative bg-gradient-to-r from-slate-900/80 to-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 overflow-hidden">
                {/* Accent bar */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-orange-600"
                  initial={{ scaleY: 0 }}
                  animate={phase >= 2 ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{
                    delay: i * 0.15 + 0.3,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  style={{ transformOrigin: 'top' }}
                />

                {/* Number badge */}
                <div className="absolute top-4 right-6 w-10 h-10 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center justify-center">
                  <span 
                    className="text-orange-400"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      fontWeight: 700
                    }}
                  >
                    {i + 1}
                  </span>
                </div>

                <div className="pr-16">
                  <h3
                    className="text-white mb-2"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-slate-400"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)',
                      fontWeight: 500,
                      lineHeight: 1.5
                    }}
                  >
                    {feature.desc}
                  </p>
                </div>

                {/* Highlight badge */}
                <motion.div
                  className="mt-3 inline-block px-3 py-1 bg-orange-500/20 border border-orange-500/40 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{
                    delay: i * 0.15 + 0.5,
                    duration: 0.4
                  }}
                >
                  <span
                    className="text-orange-300"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
                      fontWeight: 600
                    }}
                  >
                    {feature.highlight}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Exit transition - wipe up */}
      <motion.div
        className="absolute inset-0 bg-slate-950"
        initial={{ y: '100%' }}
        exit={{ y: '0%' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
