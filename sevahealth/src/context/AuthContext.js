'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/src/lib/supabase/Client';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const result = await auth.login(email, password);
    if (result.success) {
      setUser(auth.getCurrentUser());
    }
    setLoading(false);
    return result;
  };

  const register = async (userData) => {
    setLoading(true);
    const result = await auth.register(userData);
    if (result.success) {
      setUser(auth.getCurrentUser());
    }
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    const result = await auth.logout();
    if (result.success) {
      setUser(null);
    }
    setLoading(false);
    return result;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: auth.isAuthenticated()
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);