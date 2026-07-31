import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const domains = [
    { name: 'Teknik Konstruksi', icon: 'construction' },
    { name: 'Ketenagalistrikan & EBT', icon: 'energy' },
    { name: 'Migas & Pertambangan', icon: 'oil-gas' },
    { name: 'Tender & Procurement', icon: 'tender' },
    { name: 'Business Management', icon: 'business' },
    { name: 'Perijinan & Sertifikasi', icon: 'license' },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-orange-950 via-slate-900 to-slate-950">
      {/* Radial gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 70%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-[6vw]">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-20 h-1 bg-orange-500 mx-auto mb-4" />
          <h2
            className="text-white mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 4.5vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em'
            }}
          >
            <span className="text-gradient-orange">6 Domain</span> Keahlian
          </h2>
          <p
            className="text-slate-400"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
              fontWeight: 500
            }}
          >
            AI yang memahami industri Anda
          </p>
        </motion.div>

        {/* Domain grid */}
        <motion.div
          className="grid grid-cols-3 gap-3 max-w-5xl w-full"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {domains.map((domain, i) => (
            <motion.div
              key={i}
              className="relative group"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
              transition={{
                delay: i * 0.1,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <div className="relative bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-4 h-full transition-all duration-300">
                {/* Icon container */}
                <div className="w-12 h-12 mb-3 mx-auto bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-lg flex items-center justify-center border border-orange-500/30">
                  <img 
                    src={`${import.meta.env.BASE_URL}images/icon-${domain.icon}.png`}
                    alt={domain.name}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                
                {/* Domain name */}
                <h3
                  className="text-slate-200 text-center"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(0.75rem, 1.2vw, 0.95rem)',
                    fontWeight: 600,
                    lineHeight: 1.3
                  }}
                >
                  {domain.name}
                </h3>

                {/* Hover accent */}
                <motion.div
                  className="absolute inset-0 border-2 border-orange-500 rounded-xl opacity-0"
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom accent */}
        <motion.div
          className="mt-6 flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-8 h-0.5 bg-orange-500" />
          <p
            className="text-orange-400"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
              fontWeight: 600
            }}
          >
            Pilih agen AI sesuai kebutuhan Anda
          </p>
          <div className="w-8 h-0.5 bg-orange-500" />
        </motion.div>
      </div>

      {/* Exit transition */}
      <motion.div
        className="absolute inset-0 bg-slate-950"
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        exit={{ clipPath: 'circle(150% at 50% 50%)' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
