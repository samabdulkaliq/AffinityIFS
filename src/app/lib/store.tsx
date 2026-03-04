"use client";

import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from './models';
import { repository } from './repository';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, role: UserRole, password?: string) => Promise<boolean>;
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
    const identifier = loginIdentifier.trim().toLowerCase();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

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

  const signup = async (name: string, email: string, role: UserRole, password?: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const existing = repository.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return false;

    const newUser: User = {
      id: `${role.toLowerCase()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      email: email.toLowerCase(),
      role: role,
      workerType: 'EMPLOYEE',
      phone: "Not Provided",
      status: 'ACTIVE',
      points: 500,
      avatarUrl: `https://picsum.photos/seed/${name}/100/100`,
      createdAt: new Date().toISOString(),
      certifications: [
        { id: `c-${Math.random()}`, name: 'Basic Safety', status: 'VALID', expiryDate: '2025-12-31' }
      ]
    };

    repository.addUser(newUser);
    setUser(newUser);
    router.push(role === 'ADMIN' ? '/admin' : '/cleaner');
    return true;
  };

  const logout = () => {
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isMockMode, setMockMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
