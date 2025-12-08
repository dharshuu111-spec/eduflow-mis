import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration - in production, this would be from a database
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin': {
    password: 'admin123',
    user: {
      id: '1',
      username: 'admin',
      email: 'admin@mis.edu',
      role: 'admin',
      name: 'Administrator',
    }
  },
  'teacher': {
    password: 'teacher123',
    user: {
      id: '2',
      username: 'teacher',
      email: 'sreedhar@nttf.co.in',
      role: 'teacher',
      name: 'Mr. Sreedhar E',
      department: 'CP09',
    }
  },
  'student': {
    password: 'student123',
    user: {
      id: '3',
      username: 'student',
      email: 'student@nttf.co.in',
      role: 'student',
      name: 'Rithick Roshan',
      department: 'CP09',
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userRecord = mockUsers[username.toLowerCase()];
    
    if (!userRecord) {
      return { success: false, error: 'Invalid username' };
    }

    if (userRecord.password !== password) {
      return { success: false, error: 'Invalid password' };
    }

    if (userRecord.user.role !== role) {
      return { success: false, error: 'Invalid role selected' };
    }

    setUser(userRecord.user);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
