import { motion } from 'framer-motion';

export const Scene0Intro = () => {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="w-full h-[2px] bg-primary/30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="z-10 text-center flex flex-col items-center">
        <motion.div
          className="overflow-hidden flex items-center justify-center"
        >
          <motion.div
            className="w-12 h-12 bg-primary rounded-xl mb-6 shadow-[0_0_40px_rgba(255,100,0,0.5)] flex items-center justify-center"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
            </svg>
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-7xl font-display font-bold tracking-tight text-white flex gap-[2px] overflow-hidden"
        >
          {Array.from("KonstruksiAI").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: "100%", opacity: 0, rotateX: -90 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.6, type: "spring", damping: 15 }}
              className={i >= 10 ? "text-primary" : ""}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          className="mt-6 overflow-hidden"
        >
          <motion.p
            className="text-2xl text-secondary font-medium tracking-wide"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
          >
            Asisten Cerdas Keteknikan Indonesia
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};
