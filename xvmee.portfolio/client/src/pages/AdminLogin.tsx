import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminPanel from '@/components/auth/AdminPanel';
import { useToast } from '@/hooks/use-toast';
import { login, logout, useAuth } from '@/lib/auth';
import { LoadingSpinner } from '@/assets/icons';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Błąd!",
        description: "Wypełnij wszystkie pola",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await login(username, password);
      toast({
        title: "Zalogowano!",
        description: "Witaj w panelu administratora",
      });
    } catch (error) {
      toast({
        title: "Błąd logowania!",
        description: "Niepoprawna nazwa użytkownika lub hasło",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    
    try {
      await logout();
      toast({
        title: "Wylogowano",
        description: "Zostałeś wylogowany z panelu administratora",
      });
      setLocation('/admin');
    } catch (error) {
      toast({
        title: "Błąd!",
        description: "Nie udało się wylogować",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex justify-center items-center">
        <LoadingSpinner className="w-12 h-12 text-[#FF6EBF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />
      
      <div className="py-20 relative bg-[#202225]/50">
        <div className="container mx-auto px-4 pt-20">
          <div className="max-w-md mx-auto">
            {isAuthenticated ? (
              <div>
                <AdminPanel />
                <motion.button
                  className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 flex items-center justify-center"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner className="w-5 h-5 mr-2" /> : null}
                  {loading ? "Wylogowywanie..." : "Wyloguj"}
                </motion.button>
              </div>
            ) : (
              <div className="bg-[#36393f] rounded-xl p-8 shadow-lg">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-1">Panel <span className="text-[#FF6EBF]">Administratora</span></h2>
                  <p className="text-gray-400 text-sm">Zaloguj się, aby zarządzać portfolio</p>
                </div>
                
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-400 mb-2 text-sm">Nazwa użytkownika</label>
                    <input 
                      type="text" 
                      id="username" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#2f3136] border border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:border-[#FF6EBF] transition-colors" 
                      placeholder="Wprowadź nazwę użytkownika"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-400 mb-2 text-sm">Hasło</label>
                    <input 
                      type="password" 
                      id="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#2f3136] border border-gray-700 rounded-md py-2 px-4 text-white focus:outline-none focus:border-[#FF6EBF] transition-colors" 
                      placeholder="Wprowadź hasło"
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    className="w-full bg-[#FF6EBF] hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 discord-button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading ? <LoadingSpinner className="w-5 h-5 mr-2" /> : null}
                    {loading ? "Logowanie..." : "Zaloguj się"}
                  </motion.button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;
