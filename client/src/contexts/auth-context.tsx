import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'wouter';

// Simple API request helper since @/lib/api is missing
async function apiRequest(method: string, endpoint: string, data?: any) {
  const response = await fetch(`/api${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
}

type User = {
  id: string;
  email: string;
  name: string;
  // Add other user fields as needed
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: { email: string; password: string; name: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        const userData = await apiRequest('GET', '/auth/me');
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const userData = await apiRequest('POST', '/auth/login', { email, password });
    setUser(userData);
    setLocation('/');
  };

  const register = async (data: { email: string; password: string; name: string }) => {
    const userData = await apiRequest('POST', '/auth/register', data);
    setUser(userData);
    setLocation('/');
  };

  const logout = async () => {
    try {
      await apiRequest('POST', '/auth/logout');
    } finally {
      setUser(null);
      setLocation('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};