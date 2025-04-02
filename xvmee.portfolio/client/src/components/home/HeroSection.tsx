import React from 'react';
import { motion } from 'framer-motion';
import DiscordWidget from './DiscordWidget';

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="pt-32 pb-16 md:pb-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF6EBF]/20 to-transparent opacity-30"></div>
        <div className="absolute -top-[50%] -left-[25%] w-[90%] h-[90%] rounded-full bg-[#FF6EBF]/10 blur-3xl"></div>
        <div className="absolute -bottom-[50%] -right-[25%] w-[90%] h-[90%] rounded-full bg-[#FF6EBF]/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              <span className="block">Witaj w moim</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6EBF] to-[#FFCCE5]">
                portfolio
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Jestem <span className="text-[#FF6EBF] font-bold">XVMEE</span>, programista i twórca botów Discord.
              Specjalizuję się w tworzeniu niestandardowych rozwiązań dla społeczności Discord.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a 
                href="#portfolio" 
                className="discord-button bg-[#FF6EBF] hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Zobacz portfolio
              </motion.a>
              <motion.a 
                href="#about" 
                className="discord-button bg-transparent border-2 border-white hover:border-[#FF6EBF] hover:text-[#FF6EBF] text-white font-bold py-3 px-8 rounded-full transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                O mnie
              </motion.a>
            </div>
          </motion.div>
          
          <div className="md:w-1/2 w-full">
            <DiscordWidget />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
