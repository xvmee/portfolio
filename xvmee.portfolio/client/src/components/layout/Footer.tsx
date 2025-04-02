import React from 'react';
import { DiscordIcon } from '@/assets/icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#202225] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6EBF] via-[#FFCCE5] to-[#FF6EBF]"></div>
        <div className="absolute -top-[80%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#FF6EBF]/5 blur-3xl"></div>
        <div className="absolute -bottom-[80%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#FF6EBF]/5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="md:w-1/3">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <img 
                src="https://i.imgur.com/EUqGLwy.png" 
                alt="XVMEE Logo" 
                className="w-12 h-12 rounded-full mr-3"
              />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#FF6EBF]">
                XVMEE
              </span>
            </div>
            <p className="text-gray-400 text-center md:text-left mb-6">
              Tworzę niestandardowe rozwiązania dla społeczności Discord, strony internetowe i aplikacje.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-[#2f3136] rounded-full flex items-center justify-center text-white hover:bg-[#FF6EBF] transition-colors duration-300"
                aria-label="Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a 
                href="https://discord.gg/vb3Dtvbx3B" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#2f3136] rounded-full flex items-center justify-center text-white hover:bg-[#FF6EBF] transition-colors duration-300"
                aria-label="Discord"
              >
                <DiscordIcon className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#2f3136] rounded-full flex items-center justify-center text-white hover:bg-[#FF6EBF] transition-colors duration-300"
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="md:w-1/3">
            <h3 className="text-xl font-bold mb-4 text-center md:text-left">Szybkie linki</h3>
            <ul className="space-y-2 text-center md:text-left">
              <li>
                <a href="#home" className="text-gray-400 hover:text-[#FF6EBF] transition-colors duration-300">
                  Strona Główna
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-[#FF6EBF] transition-colors duration-300">
                  O Mnie
                </a>
              </li>
              <li>
                <a href="#portfolio" className="text-gray-400 hover:text-[#FF6EBF] transition-colors duration-300">
                  Portfolio
                </a>
              </li>
              <li>
                <a 
                  href="https://discord.gg/vb3Dtvbx3B" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#FF6EBF] transition-colors duration-300"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>
          
          <div className="md:w-1/3">
            <h3 className="text-xl font-bold mb-4 text-center md:text-left">Kontakt</h3>
            <div className="space-y-2 text-center md:text-left">
              <p className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-[#FF6EBF]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                xvmee@example.com
              </p>
              <p className="text-gray-400">
                <DiscordIcon className="h-5 w-5 inline-block mr-2 text-[#FF6EBF]" />
                XVMEE#1234
              </p>
              <a 
                href="https://discord.gg/vb3Dtvbx3B" 
                target="_blank" 
                rel="noopener noreferrer"
                className="discord-button mt-4 inline-block bg-[#5865F2] hover:bg-opacity-90 text-white font-bold py-2 px-6 rounded-md transition-all duration-300"
              >
                <DiscordIcon className="h-4 w-4 inline-block mr-2" />
                Napisz na Discord
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 mb-4">
            &copy; {new Date().getFullYear()} XVMEE. Wszelkie prawa zastrzeżone.
          </p>
          <p className="animate-glow">
            <span className="text-[#FFD700] font-bold">Strona stworzona przez xvmee</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
