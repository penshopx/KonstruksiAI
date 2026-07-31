import { motion } from 'framer-motion';

export const Scene5Outro = () => {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="w-24 h-24 bg-primary rounded-3xl mb-8 shadow-[0_0_60px_rgba(255,100,0,0.6)] flex items-center justify-center"
        initial={{ scale: 0, rotate: 90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, duration: 1, type: "spring", bounce: 0.5 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
        </svg>
      </motion.div>

      <motion.h1
        className="text-8xl font-display font-bold text-white mb-6 tracking-tight"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        Konstruksi<span className="text-primary">AI</span>
      </motion.h1>

      <motion.p
        className="text-2xl text-secondary tracking-widest uppercase font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        Asisten Cerdas Keteknikan Indonesia
      </motion.p>
      
      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <motion.div 
          className="w-[200vw] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          initial={{ scaleX: 0, rotate: -30 }}
          animate={{ scaleX: 1, rotate: -30 }}
          transition={{ delay: 1, duration: 1.5 }}
        />
        <motion.div 
          className="w-[200vw] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent absolute"
          initial={{ scaleX: 0, rotate: 30 }}
          animate={{ scaleX: 1, rotate: 30 }}
          transition={{ delay: 1.2, duration: 1.5 }}
        />
      </div>
    </motion.div>
  );
};
