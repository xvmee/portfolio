import React from 'react';
import { motion } from 'framer-motion';

const AboutSection: React.FC = () => {
  const skills = [
    "JavaScript", "Python", "HTML/CSS", "Discord.js", "React", "Node.js"
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6EBF]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF6EBF]/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4">O <span className="text-[#FF6EBF]">Mnie</span></h2>
          <div className="w-24 h-1 bg-[#FF6EBF] mx-auto rounded-full"></div>
        </motion.div>
        
        <div className="flex flex-col md:flex-row items-center gap-10">
          <motion.div 
            className="md:w-1/3 w-full"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6EBF] to-[#FFCCE5] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative">
                <img 
                  src="https://i.imgur.com/EUqGLwy.png" 
                  alt="XVMEE Profile" 
                  className="rounded-lg w-full object-cover object-center h-80"
                />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-2/3 w-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-[#36393f] rounded-xl p-6 shadow-lg">
              <div className="flex mb-4 items-center">
                <div className="w-10 h-10 rounded-full bg-[#FF6EBF] flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">XVMEE</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Cześć! Jestem XVMEE, programista i twórca botów Discord. Zajmuję się tworzeniem niestandardowych rozwiązań dla społeczności Discord, stron internetowych oraz aplikacji.
                </p>
                <p className="text-gray-300 mb-4">
                  Specjalizuję się w językach takich jak JavaScript, Python i HTML/CSS. Moją pasją jest tworzenie intuicyjnych interfejsów i funkcjonalnych narzędzi, które ułatwiają codzienną pracę.
                </p>
                <p className="text-gray-300">
                  Poza programowaniem, lubię grać w gry, słuchać muzyki i eksplorować nowe technologie. Zawsze szukam nowych wyzwań i możliwości rozwoju.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <motion.span 
                    key={index} 
                    className="px-3 py-1 bg-[#5865F2] rounded-full text-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ y: -3, scale: 1.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
