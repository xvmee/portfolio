import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Loading: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-[#0F0F0F] flex flex-col justify-center items-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-32 h-32">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FF6EBF]"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-4 border-transparent border-t-white"
          animate={{ rotate: -360 }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </div>
      <motion.div 
        className="mt-16 text-[#FF6EBF] font-bold text-2xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Ładowanie...
      </motion.div>
    </motion.div>
  );
};

export default Loading;
