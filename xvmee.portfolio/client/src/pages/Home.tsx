import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import PortfolioSection from '@/components/home/PortfolioSection';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <Footer />
    </div>
  );
};

export default Home;
