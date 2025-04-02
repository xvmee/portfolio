import React from 'react';
import { motion } from 'framer-motion';
import { DiscordIcon } from '@/assets/icons';

const DiscordWidget: React.FC = () => {
  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div 
        className="bg-[#36393f] rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#FF6EBF]/20"
        whileHover={{ y: -5 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          y: { 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
      >
        <div className="p-4 bg-[#2f3136] flex items-center">
          <img 
            src="https://i.imgur.com/EUqGLwy.png" 
            alt="S4mencik Community" 
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="font-bold text-white">S4mencik Community</h3>
            <p className="text-gray-400 text-sm">Społeczność Discord</p>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-300 mb-4">
            Dołącz do mojego serwera Discord, aby kupić boty lub porozmawiać o współpracy. 
            Znajdziesz tam również świetną społeczność!
          </p>
          
          <div className="flex items-center text-gray-400 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Aktywni użytkownicy</span>
            
            <div className="ml-auto flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-xs">JD</div>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs">MK</div>
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-xs">AS</div>
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-xs">+8</div>
            </div>
          </div>
          
          <motion.a 
            href="https://discord.gg/vb3Dtvbx3B" 
            target="_blank"
            rel="noopener noreferrer"
            className="discord-button w-full bg-[#5865F2] hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 flex items-center justify-center relative overflow-hidden"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <DiscordIcon className="w-5 h-5 mr-2" />
            Dołącz do serwera
            <motion.div 
              className="absolute inset-0 bg-white opacity-0"
              animate={{ 
                x: ["0%", "100%"],
                opacity: [0, 0.1, 0]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3
              }}
            />
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DiscordWidget;
