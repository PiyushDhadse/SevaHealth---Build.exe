'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../lib/supabase/Client';

const AuthContext = createContext({});

// Set to true to bypass real Supabase auth and use a mock session
const MOCK_AUTH = true;

const MOCK_USER = {
  id: 'mock-supervisor-123',
  email: 'supervisor@demo.com',
  name: 'Demo Supervisor',
  user_type: 'supervisor',
  city: 'Mumbai',
  logged_in: true,
  is_mock: true
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    try {
      const currentUser = auth.getCurrentUser();

      // Allow switching roles via URL parameter for testing (e.g., ?role=doctor)
      let urlRole = null;
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        urlRole = params.get('role');
      }

      if (urlRole && ['doctor', 'asha_worker', 'supervisor'].includes(urlRole)) {
        console.log(`AuthContext: Switching to role from URL: ${urlRole}`);
        const roleUser = {
          ...MOCK_USER,
          user_type: urlRole,
          name: urlRole === 'doctor' ? 'Demo Doctor' : urlRole === 'asha_worker' ? 'Demo ASHA Worker' : 'Demo Supervisor'
        };
        setUser(roleUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sevahealth_user', JSON.stringify(roleUser));
        }
      } else if (currentUser) {
        console.log('AuthContext: Initializing with user:', currentUser);
        setUser(currentUser);
      } else if (MOCK_AUTH) {
        console.log('AuthContext: No user found, using MOCK_USER session');
        setUser(MOCK_USER);
        // Persist mock user to localStorage so other parts of the app can see it
        if (typeof window !== 'undefined') {
          localStorage.setItem('sevahealth_user', JSON.stringify(MOCK_USER));
          localStorage.setItem('sevahealth_token', 'mock_token_' + Date.now());
        }
      }
    } catch (err) {
      console.error('AuthContext: Failed to load user:', err);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const result = await auth.login(email, password);
    if (result.success) {
      const currentUser = auth.getCurrentUser();
      console.log('AuthContext: Login success, setting user:', currentUser);
      setUser(currentUser);
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