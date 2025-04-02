import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MenuIcon, CloseIcon } from "@/assets/icons";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0F0F0F]/90 backdrop-blur-md py-2" : "py-6"}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <img 
              src="https://i.imgur.com/EUqGLwy.png" 
              alt="XVMEE Logo" 
              className="w-10 h-10 rounded-full mr-3 group-hover:scale-110 transition-transform"
            />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#FF6EBF]">
              XVMEE
            </span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <a 
              href="#home" 
              className="hover:text-[#FF6EBF] transition-colors duration-300"
              onClick={closeMenu}
            >
              Strona Główna
            </a>
            <a 
              href="#about" 
              className="hover:text-[#FF6EBF] transition-colors duration-300"
              onClick={closeMenu}
            >
              O Mnie
            </a>
            <a 
              href="#portfolio" 
              className="hover:text-[#FF6EBF] transition-colors duration-300"
              onClick={closeMenu}
            >
              Portfolio
            </a>
            <Link 
              href="/admin" 
              className="text-[#FF6EBF] hover:text-[#FFCCE5] transition-colors duration-300"
            >
              Admin
            </Link>
          </div>
          
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none" aria-label="Menu">
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden absolute top-full left-0 right-0 bg-[#2f3136] rounded-b-lg shadow-xl p-4 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col space-y-4">
              <a 
                href="#home" 
                className="hover:text-[#FF6EBF] transition-colors duration-300 p-2"
                onClick={closeMenu}
              >
                Strona Główna
              </a>
              <a 
                href="#about" 
                className="hover:text-[#FF6EBF] transition-colors duration-300 p-2"
                onClick={closeMenu}
              >
                O Mnie
              </a>
              <a 
                href="#portfolio" 
                className="hover:text-[#FF6EBF] transition-colors duration-300 p-2"
                onClick={closeMenu}
              >
                Portfolio
              </a>
              <Link 
                href="/admin" 
                className="text-[#FF6EBF] hover:text-[#FFCCE5] transition-colors duration-300 p-2"
                onClick={closeMenu}
              >
                Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
