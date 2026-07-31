import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Scene1Chat = () => {
  const [showTyping, setShowTyping] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "Apa syarat utama untuk SBU Konstruksi kualifikasi Menengah?";
  
  useEffect(() => {
    // Sequence
    const timers = [
      setTimeout(() => setShowTyping(true), 800),
      setTimeout(() => setShowResponse(true), 4000),
    ];
    
    // Typewriter effect
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setTypedText(fullText.substring(0, charIndex + 1));
        charIndex++;
      }
    }, 40);
    
    return () => {
      timers.forEach(t => clearTimeout(t));
      clearInterval(typeInterval);
    };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10 px-24"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ x: "-100vw", opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col w-full max-w-5xl h-[70vh] glass-panel rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="h-16 border-b border-white/5 flex items-center px-6 bg-white/5">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-4 shadow-[0_0_15px_rgba(255,100,0,0.5)]">
             <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
               <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
             </svg>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">KonstruksiAI</h2>
            <p className="text-xs text-primary font-mono tracking-wider uppercase">Agent: Konstruksi</p>
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 p-8 flex flex-col justify-end gap-6 pb-24">
          <motion.div 
            className="self-end max-w-[70%]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <div className="user-msg p-4 px-6 text-lg shadow-lg">
              {typedText}
              <motion.span 
                animate={{ opacity: [1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-5 bg-white ml-1 align-middle"
              />
            </div>
          </motion.div>
          
          {showTyping && !showResponse && (
            <motion.div 
              className="self-start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="ai-msg p-4 px-6 flex items-center gap-2">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0, duration: 0.6 }} className="w-2 h-2 rounded-full bg-primary" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.2, duration: 0.6 }} className="w-2 h-2 rounded-full bg-primary" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.4, duration: 0.6 }} className="w-2 h-2 rounded-full bg-primary" />
              </div>
            </motion.div>
          )}

          {showResponse && (
            <motion.div 
              className="self-start max-w-[80%]"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <div className="ai-msg p-6 text-lg shadow-lg flex flex-col gap-4 text-gray-200">
                <p>Untuk SBU Konstruksi Kualifikasi Menengah (M), syarat utamanya adalah:</p>
                <motion.ul className="list-disc pl-5 space-y-2 text-white"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.4 } } } as unknown as import('framer-motion').Variants}
                >
                  <motion.li variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                    Memiliki <strong>Penanggung Jawab Badan Usaha (PJBU)</strong>
                  </motion.li>
                  <motion.li variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                    Memiliki minimal 1 (satu) orang <strong>PJTBU</strong> dengan SKK jenjang 7 atau 8
                  </motion.li>
                  <motion.li variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                    Nilai kekayaan bersih minimal <strong>Rp 2.000.000.000</strong>
                  </motion.li>
                </motion.ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Huge title behind or floating */}
      <motion.div 
        className="absolute top-12 left-24 -z-10 pointer-events-none"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h2 className="text-8xl font-display font-bold text-white/5 uppercase tracking-tighter">
          Instant<br/>Answers
        </h2>
      </motion.div>
    </motion.div>
  );
};
