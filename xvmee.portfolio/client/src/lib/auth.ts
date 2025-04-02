import { apiRequest } from './queryClient';
import { useState, useEffect } from 'react';

// Session check query
async function checkSession(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/check', { 
      credentials: 'include'
    });
    
    if (!res.ok) return false;
    
    const data = await res.json();
    return !!data.authenticated;
  } catch (error) {
    return false;
  }
}

// Login function
export async function login(username: string, password: string): Promise<void> {
  const res = await apiRequest('POST', '/api/auth/login', { username, password });
  const data = await res.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Login failed');
  }
}

// Logout function
export async function logout(): Promise<void> {
  await apiRequest('POST', '/api/auth/logout', {});
}

// Auth hook
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      setIsLoading(true);
      const authenticated = await checkSession();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    }
    
    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
}
