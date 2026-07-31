import { motion } from 'framer-motion';

export const Scene2SBU = () => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ x: "100vw" }}
      animate={{ x: 0 }}
      exit={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-full flex px-24 items-center gap-16">
        
        {/* Left side text */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h2 className="text-6xl font-display font-bold leading-tight mb-6">
              Panduan <span className="text-primary">SBU & SKK</span><br/>Terstruktur
            </h2>
            <p className="text-2xl text-secondary max-w-lg leading-relaxed">
              Dapatkan panduan langkah demi langkah untuk sertifikasi badan usaha dan tenaga kerja konstruksi tanpa pusing.
            </p>
          </motion.div>
        </div>

        {/* Right side cards (isometric stack) */}
        <div className="flex-1 relative h-[60vh]" style={{ perspective: "1000px" }}>
          <motion.div
            className="absolute inset-0"
            initial={{ rotateX: 20, rotateY: -30, rotateZ: 10, scale: 0.8, opacity: 0 }}
            animate={{ rotateX: 20, rotateY: -30, rotateZ: 10, scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1, type: "spring" }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Card 1 - SKK */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-80 h-48 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl border border-white/10 p-6 shadow-2xl flex flex-col justify-between"
              style={{ transform: "translateZ(100px)" }}
              initial={{ z: 0, opacity: 0 }}
              animate={{ z: 100, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-xl">SKK</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
                  Jenjang 7
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Ahli Teknik Bangunan Gedung</h3>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500" 
                    initial={{ width: 0 }} 
                    animate={{ width: "100%" }} 
                    transition={{ delay: 2, duration: 1 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Card 2 - SBU */}
            <motion.div
              className="absolute top-1/2 left-1/3 w-80 h-48 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl border border-primary/30 p-6 shadow-[0_20px_50px_rgba(255,100,0,0.2)] flex flex-col justify-between"
              style={{ transform: "translateZ(200px)" }}
              initial={{ z: 0, opacity: 0 }}
              animate={{ z: 200, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50">
                  <span className="text-primary font-bold text-xl">SBU</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
                  Menengah
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Bangunan Sipil (BS)</h3>
                <div className="flex gap-2 mt-2">
                  <div className="w-1/3 h-2 bg-primary/30 rounded-full" />
                  <div className="w-1/2 h-2 bg-primary/30 rounded-full" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};
