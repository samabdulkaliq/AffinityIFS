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

  const login = async (email: string, password?: string) => {
    // In production, this would use Firebase Auth.
    // For the demo, we find the user by email in the repository.
    const mockUser = repository.users.find(u => u.email.toLowerCase() === email.toLowerCase());
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
