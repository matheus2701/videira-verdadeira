
'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useMemo, useCallback } from 'react';
import type { User, Role, Vida, CellGroup, CellMeetingStatus } from '@/types'; // Import Vida and CellGroup

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loginAs: (role: Role) => void;
  logout: () => void;
  // Mock data for demonstration purposes, would come from a backend in a real app
  mockVidas: Vida[];
  mockCellGroups: CellGroup[];
  updateMockVida: (updatedVida: Vida) => void;
  addMockVida: (newVida: Vida) => void;
  updateMockCellGroup: (updatedCG: CellGroup) => void;
  addMockCellGroup: (newCG: CellGroup) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data inicial para Vidas
const initialMockVidas: Vida[] = [
  { id: 'vida-lider-joao', nomeCompleto: 'Líder João', dataNascimento: new Date(1988, 2, 10), telefone: '(11) 91234-5678', idCelula: 'celula-discipulos-001', nomeCelula: 'Discípulos de Cristo', geracaoCelula: 'G1', status: 'lider_ativo', createdAt: new Date() },
  { id: 'vida-ana', nomeCompleto: 'Ana Silva (Membro)', dataNascimento: new Date(1990, 5, 15), idCelula: 'celula-discipulos-001', nomeCelula: 'Discípulos de Cristo', geracaoCelula: 'G1', status: 'membro', createdAt: new Date() },
  { id: 'vida-bruno', nomeCompleto: 'Bruno Costa (Outra Célula)', dataNascimento: new Date(1985, 8, 22), idCelula: 'celula-leoes-002', nomeCelula: 'Leões de Judá', geracaoCelula: 'G2', status: 'membro', createdAt: new Date() },
];

// Mock initial Cell Groups
const initialMockCellGroups: CellGroup[] = [
    { 
      id: 'celula-discipulos-001', 
      name: 'Discípulos de Cristo', 
      address: 'Rua da Fé, 123', 
      meetingDay: 'Quarta-feira', 
      meetingTime: '19:30', 
      geracao: 'G1', 
      liderVidaId: 'vida-lider-joao', 
      liderNome: 'Líder João',
      meetingStatus: 'aconteceu',
      lastStatusUpdate: new Date(new Date().setDate(new Date().getDate() - 2)) // 2 days ago
    },
    { 
      id: 'celula-leoes-002', 
      name: 'Leões de Judá', 
      address: 'Av. Esperança, 456', 
      meetingDay: 'Quinta-feira', 
      meetingTime: '20:00', 
      geracao: 'G2',
      meetingStatus: 'agendada',
      lastStatusUpdate: new Date(new Date().setDate(new Date().getDate() - 7)) // 7 days ago
    },
];


// Mock Users
const mockMissionario: User = {
  id: 'user-missionario-01',
  name: 'Admin Missionário',
  email: 'missionario@videira.app',
  role: 'missionario',
};

const mockLiderUser: User = {
  id: 'user-lider-joao-01',
  name: 'Líder João', // Nome do usuário logado
  email: 'lider.joao@videira.app',
  role: 'lider_de_celula',
  vidaId: 'vida-lider-joao', // ID da Vida correspondente
  cellGroupId: 'celula-discipulos-001', // ID da célula que ele lidera
  cellGroupName: 'Discípulos de Cristo', // Nome da célula para exibição
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockMissionario);
  const [vidasData, setVidasData] = useState<Vida[]>(initialMockVidas);
  const [cellGroupsData, setCellGroupsData] = useState<CellGroup[]>(initialMockCellGroups);

  const loginAs = useCallback((role: Role) => {
    if (role === 'missionario') {
      setUser(mockMissionario);
    } else {
      setUser(mockLiderUser);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateMockVida = (updatedVida: Vida) => {
    setVidasData(prev => prev.map(v => v.id === updatedVida.id ? updatedVida : v));
  };
  const addMockVida = (newVida: Vida) => {
    setVidasData(prev => [newVida, ...prev]);
  };
   const updateMockCellGroup = (updatedCG: CellGroup) => {
    setCellGroupsData(prev => {
      const newGroups = prev.map(cg => cg.id === updatedCG.id ? updatedCG : cg);
      // If user is a leader and their cell group was updated, update user's cellGroupName
      if (user?.role === 'lider_de_celula' && user.cellGroupId === updatedCG.id && user.cellGroupName !== updatedCG.name) {
        setUser(prevUser => prevUser ? {...prevUser, cellGroupName: updatedCG.name} : null);
      }
      return newGroups;
    });
  };
  const addMockCellGroup = (newCG: CellGroup) => {
    setCellGroupsData(prev => [newCG, ...prev]);
  };


  const value = useMemo(() => ({
    user,
    setUser,
    loginAs,
    logout,
    mockVidas: vidasData,
    mockCellGroups: cellGroupsData,
    updateMockVida,
    addMockVida,
    updateMockCellGroup,
    addMockCellGroup,
  }), [user, loginAs, logout, vidasData, cellGroupsData]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
