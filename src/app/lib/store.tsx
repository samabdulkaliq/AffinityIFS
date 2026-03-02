"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from './models';
import { repository } from './repository';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isMockMode: boolean;
  setMockMode: (mode: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isMockMode, setMockMode] = useState(true);
  const router = useRouter();

  const login = (role: UserRole) => {
    // For demo, just pick the first user with that role
    const mockUser = repository.users.find(u => u.role === role);
    if (mockUser) {
      setUser(mockUser);
      router.push(role === 'ADMIN' ? '/admin' : '/cleaner');
    }
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
