'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Role } from '@/types';
import { authService } from '@/services';
import { DemoRepository } from '@/lib/demoRepository';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isLoading: boolean;
  login: (identifier: string, password?: string, role?: Role) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (newRole: Role) => Promise<void>;
  resetDemoDatabase: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const current = await authService.getCurrentUser();
        setUser(current);
      } catch (err) {
        console.error('Failed to load active user', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (identifier: string, password: string = 'password', targetRole?: Role) => {
    setIsLoading(true);
    try {
      const res = await authService.loginWithId(identifier, password, targetRole);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || 'Invalid ID or password.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = async (newRole: Role) => {
    setIsLoading(true);
    try {
      const switchedUser = await authService.switchDemoUser(newRole);
      setUser(switchedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const resetDemoDatabase = () => {
    DemoRepository.resetDemoData();
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isLoading,
        login,
        logout,
        switchRole,
        resetDemoDatabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
