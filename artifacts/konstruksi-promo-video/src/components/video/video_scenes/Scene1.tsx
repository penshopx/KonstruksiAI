import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 2400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const challenges = [
    "Tender yang kompleks",
    "Sertifikasi SBU & SKK",
    "Analisis dokumen teknis"
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Diagonal split background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-950/20 to-transparent"
        initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
        animate={{ clipPath: 'polygon(0 0, 40% 0, 20% 100%, 0 100%)' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Floating accent shapes */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-40 h-40 border border-orange-500/30 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Main content */}
      <div className="relative z-10 flex h-full flex-col justify-start overflow-hidden px-[8vw] pb-[22%] pt-[9%]">
        {/* Problem statement header */}
        <motion.div
          className="mb-[clamp(1.25rem,4vh,3rem)]"
          initial={{ opacity: 0, x: -60 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-16 h-1 bg-orange-500 mb-4" />
          <h2 
            className="text-slate-300"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.8rem, min(2vw, 3vh), 1.25rem)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          >
            Tantangan Profesional
          </h2>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="mb-[clamp(1.25rem,4vh,4rem)] max-w-[94%] text-white"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.9rem, min(7vw, 10vh), 5.5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Industri konstruksi
          <br />
          <span className="text-gradient-orange">butuh jawaban cepat</span>
        </motion.h1>

        {/* Challenge list */}
        <div className="max-w-2xl space-y-3">
          {challenges.map((challenge, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -40 }}
              animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{ 
                delay: i * 0.15, 
                duration: 0.6, 
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
              <p 
                className="text-slate-400"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.85rem, min(2.2vw, 3vh), 1.4rem)',
                  fontWeight: 500
                }}
              >
                {challenge}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Accent element */}
        <motion.div
          className="absolute bottom-[26%] right-[8vw] h-24 w-24 rotate-12 border-2 border-orange-500/40"
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={phase >= 4 ? { opacity: 1, scale: 1, rotate: 12 } : { opacity: 0, scale: 0, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Exit transition */}
      <motion.div
        className="absolute inset-0 bg-orange-500"
        initial={{ scaleX: 0, transformOrigin: 'left' }}
        exit={{ scaleX: 1, transformOrigin: 'left' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
