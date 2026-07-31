import { motion } from 'framer-motion';

export const Scene4Agents = () => {
  const agents = [
    { name: 'Konstruksi', desc: 'Sipil & Arsitektur', img: 'icon-construction.png', delay: 0 },
    { name: 'Energi', desc: 'Ketenagalistrikan', img: 'icon-energy.png', delay: 0.2 },
    { name: 'Migas', desc: 'Minyak & Gas', img: 'icon-oil.png', delay: 0.4 },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 1.2, opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="text-center mb-16"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <h2 className="text-5xl font-display font-bold text-white mb-4">
          Multi-Agent <span className="text-primary">Intelligence</span>
        </h2>
        <p className="text-xl text-secondary">
          Pilih pakar AI sesuai sektor proyek Anda.
        </p>
      </motion.div>

      <div className="flex gap-10 px-12 items-center justify-center w-full">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.name}
            className="relative w-[22vw] h-[50vh] glass-panel rounded-3xl border border-white/10 flex flex-col items-center justify-center p-8 group overflow-hidden"
            initial={{ y: 100, opacity: 0, rotateY: -20 }}
            animate={{ y: 0, opacity: 1, rotateY: 0 }}
            transition={{ delay: 0.6 + agent.delay, duration: 0.8, type: "spring" }}
          >
            {/* Active glow on hover equivalent */}
            <motion.div 
              className="absolute inset-0 opacity-0 bg-gradient-to-t from-primary/20 to-transparent"
              animate={i === 0 ? { opacity: [0.2, 0.5, 0.2] } : {}}
              transition={{ repeat: Infinity, duration: 3 }}
            />
            {i === 0 && (
              <motion.div 
                className="absolute inset-0 border-2 border-primary rounded-3xl"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              />
            )}

            {/* Icon/Image Placeholder */}
            <motion.div 
              className="w-32 h-32 mb-8 relative flex items-center justify-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: i * 0.5, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
              <img 
                src={`${import.meta.env.BASE_URL}images/${agent.img}`} 
                alt={agent.name} 
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML += `<div class="w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center text-primary font-bold text-xl">${agent.name[0]}</div>`;
                }}
              />
            </motion.div>

            <h3 className="text-3xl font-display font-bold text-white mb-2 relative z-10">{agent.name}</h3>
            <p className="text-secondary font-medium relative z-10">{agent.desc}</p>
            
            {i === 0 && (
              <motion.div
                className="absolute top-6 right-6 w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(255,100,0,1)]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.8, type: "spring" }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
