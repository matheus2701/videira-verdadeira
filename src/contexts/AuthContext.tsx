
'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useMemo, useCallback } from 'react';
import type { User, Role } from '@/types';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loginAs: (role: Role) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users
const mockMissionario: User = {
  id: 'user-missionario-01',
  name: 'Admin Missionário',
  email: 'missionario@videira.app',
  role: 'missionario',
};

const mockLiderCelula: User = {
  id: 'user-lider-01',
  name: 'Líder João',
  email: 'lider.joao@videira.app',
  role: 'lider_de_celula',
  cellGroupId: 'celula-alpha-123',
  cellGroupName: 'Discípulos de Cristo',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockMissionario); // Default to Missionario for demo

  const loginAs = useCallback((role: Role) => {
    if (role === 'missionario') {
      setUser(mockMissionario);
    } else {
      setUser(mockLiderCelula);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    setUser,
    loginAs,
    logout,
  }), [user, loginAs, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
