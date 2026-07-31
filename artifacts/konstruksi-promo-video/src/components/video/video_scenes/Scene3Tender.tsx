import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Scene3Tender = () => {
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowCharts(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ y: "-100vh", opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center px-12 pt-16 pb-24 relative">
        
        {/* Title Top Center */}
        <motion.div
          className="text-center z-20 mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className="text-5xl font-display font-bold text-white mb-4">
            Analisis <span className="text-primary">Tender & Pengadaan</span>
          </h2>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Bedah dokumen tender, analisis risiko, dan dapatkan ringkasan RAB dalam hitungan detik.
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div 
          className="w-full max-w-6xl h-[60vh] glass-panel rounded-3xl border border-white/10 p-8 flex gap-8 relative z-20 shadow-2xl"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1, type: "spring", damping: 20 }}
        >
          {/* Sidebar */}
          <div className="w-64 border-r border-white/5 pr-6 flex flex-col gap-4">
            <div className="h-8 w-3/4 bg-white/5 rounded-md mb-8" />
            {[1, 2, 3, 4].map(i => (
              <motion.div 
                key={i} 
                className={`h-12 rounded-lg flex items-center px-4 ${i === 2 ? 'bg-primary/20 border border-primary/30' : 'bg-white/5'}`}
                initial={{ x: -20, opacity: 0 }}
                animate={showCharts ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className={`w-4 h-4 rounded-sm mr-3 ${i === 2 ? 'bg-primary' : 'bg-white/20'}`} />
                <div className={`h-2 rounded-full w-24 ${i === 2 ? 'bg-primary/70' : 'bg-white/20'}`} />
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex gap-6 h-32">
              {[1, 2, 3].map(i => (
                <motion.div 
                  key={i}
                  className="flex-1 bg-white/5 rounded-2xl p-5 flex flex-col justify-between border border-white/5"
                  initial={{ y: 20, opacity: 0 }}
                  animate={showCharts ? { y: 0, opacity: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                >
                  <div className="h-3 w-16 bg-white/20 rounded-full" />
                  <div className="text-3xl font-mono font-bold text-white">
                    {i === 1 ? '94%' : i === 2 ? '12' : 'Rp 4.2M'}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Chart Area */}
            <motion.div 
              className="flex-1 bg-white/5 rounded-2xl border border-white/5 p-6 relative overflow-hidden flex items-end justify-between"
              initial={{ opacity: 0 }}
              animate={showCharts ? { opacity: 1 } : {}}
              transition={{ delay: 1, duration: 0.8 }}
            >
               {/* Decorative chart bars */}
               {[40, 60, 30, 80, 50, 90, 70, 100].map((h, i) => (
                 <motion.div 
                   key={i}
                   className="w-12 bg-gradient-to-t from-primary/10 to-primary/80 rounded-t-sm"
                   initial={{ height: 0 }}
                   animate={showCharts ? { height: `${h}%` } : {}}
                   transition={{ delay: 1.2 + i * 0.05, duration: 0.8, type: "spring" }}
                 />
               ))}
               
               {/* Analysis Badge Pop */}
               <motion.div
                 className="absolute top-8 right-8 bg-black/60 backdrop-blur-md border border-primary p-4 rounded-xl shadow-[0_0_30px_rgba(255,100,0,0.3)]"
                 initial={{ scale: 0, rotate: 10 }}
                 animate={showCharts ? { scale: 1, rotate: 0 } : {}}
                 transition={{ delay: 2, type: "spring", bounce: 0.5 }}
               >
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                     <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-4 h-4"><path d="M20 6L9 17l-5-5"/></svg>
                   </div>
                   <span className="font-bold text-white">Risiko Rendah</span>
                 </div>
               </motion.div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};
