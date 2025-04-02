import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const ITEMS_PER_PAGE = 6; // Number of items to show per page

const PortfolioSection: React.FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch portfolio items
  const { data: portfolioItems, isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ['/api/portfolio'],
  });

  // Calculate total pages
  const totalPages = portfolioItems ? Math.ceil(portfolioItems.length / ITEMS_PER_PAGE) : 0;
  
  // Get current items to display
  const getCurrentItems = () => {
    if (!portfolioItems) return [];
    const start = currentPage * ITEMS_PER_PAGE;
    return portfolioItems.slice(start, start + ITEMS_PER_PAGE);
  };

  // Navigation functions for page
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Navigation functions for lightbox gallery
  const goToNextImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!portfolioItems || selectedImageIndex === null) return;
    
    const nextIndex = (selectedImageIndex + 1) % portfolioItems.length;
    setSelectedImageIndex(nextIndex);
  }, [selectedImageIndex, portfolioItems]);

  const goToPrevImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!portfolioItems || selectedImageIndex === null) return;
    
    const prevIndex = selectedImageIndex === 0 
      ? portfolioItems.length - 1 
      : selectedImageIndex - 1;
    setSelectedImageIndex(prevIndex);
  }, [selectedImageIndex, portfolioItems]);

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(0);
  }, [portfolioItems?.length]);

  // Handle key press for modal navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      
      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevImage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, goToNextImage, goToPrevImage]);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  // Get the current displayed items
  const currentItems = getCurrentItems();

  return (
    <section id="portfolio" className="py-20 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF6EBF]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#FF6EBF]/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4">Moje <span className="text-[#FF6EBF]">Portfolio</span></h2>
          <div className="w-24 h-1 bg-[#FF6EBF] mx-auto rounded-full"></div>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Przeglądaj moje najnowsze projekty i realizacje. Kliknij na zdjęcie, aby zobaczyć szczegóły i przeglądać galerię.
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6EBF]"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems && portfolioItems.length > 0 ? (
                currentItems.map((item, index) => {
                  // Calculate the absolute index in the full array
                  const absoluteIndex = currentPage * ITEMS_PER_PAGE + index;
                  
                  return (
                    <motion.div 
                      key={item.id}
                      className="portfolio-item group cursor-pointer" 
                      onClick={() => openModal(absoluteIndex)}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="relative overflow-hidden rounded-lg bg-[#36393f] shadow-lg">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-64 object-cover object-center transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4">
                            <h3 className="text-xl font-bold text-white">{item.title}</h3>
                            <p className="text-gray-300">{item.description}</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-[#FF6EBF] rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10">
                  <p className="text-gray-400">Brak projektów w portfolio.</p>
                </div>
              )}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-4">
                <motion.button
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${currentPage === 0 ? 'bg-gray-700 cursor-not-allowed' : 'bg-[#36393f] hover:bg-[#FF6EBF]'}`}
                  onClick={goToPrevPage}
                  disabled={currentPage === 0}
                  whileHover={currentPage > 0 ? { scale: 1.1 } : {}}
                  whileTap={currentPage > 0 ? { scale: 0.95 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                
                <div className="text-white">
                  <span className="font-medium">{currentPage + 1}</span> / {totalPages}
                </div>
                
                <motion.button
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${currentPage === totalPages - 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-[#36393f] hover:bg-[#FF6EBF]'}`}
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages - 1}
                  whileHover={currentPage < totalPages - 1 ? { scale: 1.1 } : {}}
                  whileTap={currentPage < totalPages - 1 ? { scale: 0.95 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for Portfolio with Navigation */}
      <AnimatePresence>
        {selectedImageIndex !== null && portfolioItems && (
          <motion.div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {/* Close button */}
            <motion.span 
              className="absolute top-4 right-4 text-white text-4xl cursor-pointer hover:text-[#FF6EBF] z-50"
              whileHover={{ scale: 1.2 }}
              onClick={closeModal}
            >
              &times;
            </motion.span>
            
            {/* Navigation buttons */}
            <motion.button
              className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-[#36393f]/80 hover:bg-[#FF6EBF] rounded-full flex items-center justify-center text-white z-50"
              onClick={goToPrevImage}
              whileHover={{ scale: 1.1, backgroundColor: "#FF6EBF" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <motion.button
              className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-[#36393f]/80 hover:bg-[#FF6EBF] rounded-full flex items-center justify-center text-white z-50"
              onClick={goToNextImage}
              whileHover={{ scale: 1.1, backgroundColor: "#FF6EBF" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
            
            {/* Current image */}
            <motion.div
              className="relative max-w-5xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={portfolioItems[selectedImageIndex].imageUrl} 
                alt={portfolioItems[selectedImageIndex].title} 
                className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto"
              />
              
              {/* Image details */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6 rounded-b-lg">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {portfolioItems[selectedImageIndex].title}
                </h3>
                <p className="text-gray-300 mt-1">
                  {portfolioItems[selectedImageIndex].description}
                </p>
                <div className="flex mt-2 text-white/80">
                  <span className="text-sm">
                    {selectedImageIndex + 1} / {portfolioItems.length}
                  </span>
                </div>
              </div>
            </motion.div>
            
            {/* Indicator dots for navigation */}
            {portfolioItems.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {portfolioItems.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === selectedImageIndex ? 'bg-[#FF6EBF]' : 'bg-white/50 hover:bg-white'
                    } transition-colors duration-200`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(index);
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PortfolioSection;
