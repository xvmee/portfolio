import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/assets/icons';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface ImageUpload {
  file: File;
  preview: string;
}

const AdminPanel: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadQueue, setUploadQueue] = useState<ImageUpload[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalUploads, setTotalUploads] = useState(0);
  const [currentUpload, setCurrentUpload] = useState(0);

  // Get portfolio items
  const { data: portfolioItems, isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ['/api/portfolio'],
  });

  // Add portfolio item mutation
  const addMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Progress tracking for batch uploads
      if (uploadQueue.length > 1) {
        setCurrentUpload(prev => prev + 1);
        setUploadProgress(Math.round(((currentUpload + 1) / totalUploads) * 100));
      } else {
        toast({
          title: "Sukces!",
          description: "Zdjęcie zostało dodane do portfolio",
        });
        
        // Reset form for single uploads
        resetForm();
      }
      
      // Invalidate the portfolio query to refetch
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Błąd!",
        description: error.message || "Nie udało się dodać zdjęcia",
        variant: "destructive",
      });
      
      // If batch uploading, continue with next item
      if (uploadQueue.length > 1) {
        setCurrentUpload(prev => prev + 1);
        setUploadProgress(Math.round(((currentUpload + 1) / totalUploads) * 100));
      }
    }
  });

  // Delete portfolio item mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/portfolio/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Sukces!",
        description: "Zdjęcie zostało usunięte z portfolio",
      });
      
      // Invalidate the portfolio query to refetch
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Błąd!",
        description: "Nie udało się usunąć zdjęcia",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setUploadQueue([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (multipleFileInputRef.current) multipleFileInputRef.current.value = '';
    setIsUploading(false);
    setUploadProgress(0);
    setTotalUploads(0);
    setCurrentUpload(0);
  };

  const handleSingleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setUploadQueue([{
          file,
          preview: reader.result as string
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newUploads: ImageUpload[] = [];
      
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          newUploads.push({
            file,
            preview: reader.result as string
          });
          
          // Update state when all files have been processed
          if (newUploads.length === e.target.files!.length) {
            setUploadQueue(newUploads);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFromQueue = (index: number) => {
    setUploadQueue(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || uploadQueue.length === 0) {
      toast({
        title: "Błąd!",
        description: "Wypełnij wszystkie pola i dodaj przynajmniej jedno zdjęcie",
        variant: "destructive",
      });
      return;
    }

    // For single image upload
    if (uploadQueue.length === 1) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', uploadQueue[0].file);
      
      addMutation.mutate(formData);
    } 
    // For multiple images upload
    else if (uploadQueue.length > 1) {
      setIsUploading(true);
      setTotalUploads(uploadQueue.length);
      setCurrentUpload(0);
      setUploadProgress(0);
      
      // Process each image sequentially
      for (let i = 0; i < uploadQueue.length; i++) {
        const formData = new FormData();
        formData.append('title', `${title} ${i+1}`);
        formData.append('description', description);
        formData.append('image', uploadQueue[i].file);
        
        try {
          await addMutation.mutateAsync(formData);
        } catch (error) {
          console.error("Error uploading image", error);
          // Continue with next image
        }
      }
      
      // All uploads completed
      toast({
        title: "Sukces!",
        description: `Dodano ${uploadQueue.length} zdjęć do portfolio`,
      });
      
      resetForm();
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten element?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="bg-[#36393f] rounded-xl p-8 shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-center">Zarządzanie portfolio</h3>
        <p className="text-sm text-gray-400 text-center">Dodaj lub usuń zdjęcia w swoim portfolio</p>
      </div>
      
      <div className="bg-[#2f3136] rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">
            Ilość zdjęć: <span className="text-[#FF6EBF]">{portfolioItems?.length || 0}</span>
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Tytuł</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#202225] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#FF6EBF] transition-colors"
                placeholder="Tytuł projektu"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Opis</label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#202225] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#FF6EBF] transition-colors"
                placeholder="Krótki opis projektu"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Zdjęcia</label>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Single image upload */}
                <div>
                  <p className="text-xs text-gray-400 mb-2">Pojedyncze zdjęcie:</p>
                  <input
                    type="file"
                    id="single-image"
                    ref={fileInputRef}
                    onChange={handleSingleImageChange}
                    accept="image/*"
                    className="w-full bg-[#202225] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#FF6EBF] transition-colors file:mr-4 file:py-1 file:px-4
                    file:rounded-full file:border-0 file:text-sm file:font-semibold
                    file:bg-[#FF6EBF] file:text-white
                    hover:file:bg-[#FF6EBF]/80"
                  />
                </div>
                
                {/* Multiple images upload */}
                <div>
                  <p className="text-xs text-gray-400 mb-2">Wiele zdjęć na raz:</p>
                  <input
                    type="file"
                    id="multiple-images"
                    ref={multipleFileInputRef}
                    onChange={handleMultipleImagesChange}
                    accept="image/*"
                    multiple
                    className="w-full bg-[#202225] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-[#FF6EBF] transition-colors file:mr-4 file:py-1 file:px-4
                    file:rounded-full file:border-0 file:text-sm file:font-semibold
                    file:bg-[#FF6EBF] file:text-white
                    hover:file:bg-[#FF6EBF]/80"
                  />
                </div>
              </div>
            </div>
            
            {/* Image previews */}
            {uploadQueue.length > 0 && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-300">Podgląd zdjęć ({uploadQueue.length}):</p>
                  <button 
                    type="button"
                    onClick={() => setUploadQueue([])}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Wyczyść wszystkie
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {uploadQueue.map((upload, index) => (
                    <div key={index} className="relative group">
                      <div className="w-full h-32 bg-[#202225] rounded-md overflow-hidden">
                        <img src={upload.preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromQueue(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Upload progress bar for multiple uploads */}
            {isUploading && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Postęp przesyłania</span>
                  <span>{currentUpload + 1} / {totalUploads} ({uploadProgress}%)</span>
                </div>
                <div className="w-full bg-[#202225] rounded-full h-2.5">
                  <div 
                    className="bg-[#FF6EBF] h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <motion.button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={addMutation.isPending || isUploading}
            >
              {addMutation.isPending || isUploading ? (
                <LoadingSpinner className="w-5 h-5 mr-2" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
              {addMutation.isPending || isUploading ? 
                `Dodawanie (${currentUpload + 1}/${totalUploads})...` : 
                uploadQueue.length > 1 ? 
                `Dodaj ${uploadQueue.length} zdjęć do portfolio` : 
                "Dodaj do portfolio"
              }
            </motion.button>
          </div>
        </form>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner className="w-8 h-8 text-[#FF6EBF]" />
          </div>
        ) : (
          <div className="space-y-2">
            {portfolioItems && portfolioItems.length > 0 ? (
              portfolioItems.map((item) => (
                <motion.div 
                  key={item.id} 
                  className="flex items-center justify-between bg-[#202225] p-2 rounded"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center overflow-hidden">
                    <div className="w-10 h-10 bg-gray-700 rounded overflow-hidden mr-2 flex-shrink-0">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-sm font-medium truncate block">{item.title}</span>
                      <span className="text-xs text-gray-400 truncate block">{item.description}</span>
                    </div>
                  </div>
                  <motion.button 
                    className="text-red-500 hover:text-red-400"
                    onClick={() => handleDelete(item.id)}
                    whileHover={{ scale: 1.2 }}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <LoadingSpinner className="w-4 h-4" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-4">Brak elementów w portfolio. Dodaj swój pierwszy projekt!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
