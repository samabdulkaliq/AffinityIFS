"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from './models';
import { repository } from './repository';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  isMockMode: boolean;
  setMockMode: (mode: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isMockMode, setMockMode] = useState(true);
  const router = useRouter();

  const login = async (loginIdentifier: string, password?: string) => {
    // Standardize input
    const identifier = loginIdentifier.trim().toLowerCase();
    
    // In production, this would use Firebase Auth.
    // For this prototype, we check against both email and name for convenience.
    const mockUser = repository.users.find(u => 
      u.email.toLowerCase() === identifier || 
      u.name.toLowerCase() === identifier
    );

    if (mockUser) {
      setUser(mockUser);
      router.push(mockUser.role === 'ADMIN' ? '/admin' : '/cleaner');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isMockMode, setMockMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
