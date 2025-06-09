
'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useMemo, useCallback } from 'react';
import type { User, Role, Vida, CellGroup, StoredOffering, OfferingFormValues } from '@/types'; // Adicionado StoredOffering, OfferingFormValues

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loginAs: (role: Role) => void;
  logout: () => void;
  mockUsers: User[]; 
  mockVidas: Vida[];
  mockCellGroups: CellGroup[];
  mockOfferings: StoredOffering[]; // Novo
  updateMockVida: (updatedVida: Vida) => void;
  addMockVida: (newVida: Vida) => void;
  updateMockCellGroup: (updatedCG: CellGroup) => void;
  addMockCellGroup: (newCG: CellGroup) => void;
  addMockUser: (newUser: User) => void;
  updateMockUser: (updatedUser: User) => void;
  addMockOffering: (newOffering: OfferingFormValues) => void; // Novo
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data inicial para Vidas
const initialMockVidas: Vida[] = [
  { id: 'vida-lider-joao', nomeCompleto: 'Líder João', dataNascimento: new Date(1988, 2, 10), telefone: '(11) 91234-5678', idCelula: 'celula-discipulos-001', nomeCelula: 'Discípulos de Cristo', geracaoCelula: 'G1', status: 'lider_ativo', createdAt: new Date() },
  { id: 'vida-ana', nomeCompleto: 'Ana Silva (Membro)', dataNascimento: new Date(1990, 5, 15), idCelula: 'celula-discipulos-001', nomeCelula: 'Discípulos de Cristo', geracaoCelula: 'G1', status: 'membro', createdAt: new Date() },
  { id: 'vida-bruno', nomeCompleto: 'Bruno Costa (Outra Célula)', dataNascimento: new Date(1985, 8, 22), idCelula: 'celula-leoes-002', nomeCelula: 'Leões de Judá', geracaoCelula: 'G2', status: 'membro', createdAt: new Date() },
  { id: 'vida-carla', nomeCompleto: 'Carla Santos (Membro)', dataNascimento: new Date(1995, 10, 5), idCelula: 'celula-leoes-002', nomeCelula: 'Leões de Judá', geracaoCelula: 'G2', status: 'membro', createdAt: new Date() },
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
      lastStatusUpdate: new Date(new Date().setDate(new Date().getDate() - 2)) 
    },
    {
      id: 'celula-leoes-002',
      name: 'Leões de Judá',
      address: 'Av. Esperança, 456',
      meetingDay: 'Quinta-feira',
      meetingTime: '20:00',
      geracao: 'G2',
      meetingStatus: 'agendada',
      lastStatusUpdate: new Date(new Date().setDate(new Date().getDate() - 7)) 
    },
];

// Mock data para usuários
const mockMissionario: User = {
  id: 'user-missionario-01',
  name: 'Admin Missionário',
  email: 'missionario@videira.app',
  role: 'missionario',
};

const mockLiderUserInitial: User = { 
  id: 'user-lider-joao-01',
  name: 'Líder João', 
  email: 'lider.joao@videira.app',
  role: 'lider_de_celula',
  vidaId: 'vida-lider-joao', 
  cellGroupId: 'celula-discipulos-001', 
  cellGroupName: 'Discípulos de Cristo', 
};

const initialMockUsers: User[] = [mockMissionario, mockLiderUserInitial];

// Mock data inicial para Ofertas
const currentYear = new Date().getFullYear();
const initialMockOfferings: StoredOffering[] = [
  { id: "off1", amount: 50, date: new Date(2024, 5, 5), cellGroupName: "Discípulos de Cristo", notes: "Oferta semanal" },
  { id: "off2", amount: 75, date: new Date(2024, 5, 12), cellGroupName: "Leões de Judá", notes: "Culto de domingo" },
  { id: "off3", amount: 60, date: new Date(2024, 6, 3), cellGroupName: "Discípulos de Cristo" }, // Note: notes pode ser undefined
  { id: "off4", amount: 100, date: new Date(2024, 6, 10), cellGroupName: "Leões de Judá", notes: "Oferta especial" },
  { id: "off5", amount: 40, date: new Date(2024, 6, 17), cellGroupName: "Discípulos de Cristo", notes: "Para missões" },
  { id: "off6", amount: 80, date: new Date(currentYear, new Date().getMonth(), 1), cellGroupName: "Nova Geração", notes: "Oferta deste mês" },
  { id: "off7", amount: 120, date: new Date(currentYear, new Date().getMonth() -1, 15), cellGroupName: "Discípulos de Cristo", notes: "Oferta do mês passado" },
];


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockMissionario);
  const [vidasData, setVidasData] = useState<Vida[]>(initialMockVidas);
  const [cellGroupsData, setCellGroupsData] = useState<CellGroup[]>(initialMockCellGroups);
  const [usersData, setUsersData] = useState<User[]>(initialMockUsers);
  const [offeringsData, setOfferingsData] = useState<StoredOffering[]>(initialMockOfferings); // Novo estado para ofertas

  const loginAs = useCallback((role: Role) => {
    if (role === 'missionario') {
      setUser(mockMissionario);
    } else {
      const liderUser = usersData.find(u => u.role === 'lider_de_celula' && u.vidaId === 'vida-lider-joao') || mockLiderUserInitial;
      setUser(liderUser);
    }
  }, [usersData]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // Funções para Vidas
  const updateMockVida = useCallback((updatedVida: Vida) => {
    setVidasData(prev => prev.map(v => v.id === updatedVida.id ? updatedVida : v));
  }, []);

  const addMockVida = useCallback((newVida: Vida) => {
    setVidasData(prev => [newVida, ...prev]);
  }, []);

  // Funções para Grupos de Células
  const updateMockCellGroup = useCallback((updatedCG: CellGroup) => {
    setCellGroupsData(prev => {
      const newGroups = prev.map(cg => cg.id === updatedCG.id ? updatedCG : cg);
      if (user?.role === 'lider_de_celula' && user.cellGroupId === updatedCG.id && user.cellGroupName !== updatedCG.name) {
        setUser(prevUser => prevUser ? {...prevUser, cellGroupName: updatedCG.name} : null);
      }
      return newGroups;
    });
  }, [user]);

  const addMockCellGroup = useCallback((newCG: CellGroup) => {
    setCellGroupsData(prev => [newCG, ...prev]);
  }, []);

  // Funções para Usuários
  const addMockUser = useCallback((newUser: User) => {
    setUsersData(prev => {
      const existingUserIndex = prev.findIndex(u => u.vidaId && u.vidaId === newUser.vidaId);
      if (existingUserIndex !== -1) {
        const updatedUsers = [...prev];
        updatedUsers[existingUserIndex] = newUser;
        return updatedUsers;
      }
      return [newUser, ...prev];
    });
  }, []);

  const updateMockUser = useCallback((updatedUser: User) => {
    setUsersData(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser);
    }
  }, [user]);

  // Função para Ofertas
  const addMockOffering = useCallback((newOfferingData: OfferingFormValues) => {
    const newOffering: StoredOffering = {
      id: `off-${Date.now()}`,
      ...newOfferingData,
    };
    setOfferingsData(prev => [newOffering, ...prev]);
  }, []);


  const value = useMemo(() => ({
    user,
    setUser,
    loginAs,
    logout,
    mockUsers: usersData, 
    mockVidas: vidasData,
    mockCellGroups: cellGroupsData,
    mockOfferings: offeringsData, // Expor mockOfferings
    updateMockVida,
    addMockVida,
    updateMockCellGroup,
    addMockCellGroup,
    addMockUser,
    updateMockUser,
    addMockOffering, // Expor addMockOffering
  }), [user, loginAs, logout, usersData, vidasData, cellGroupsData, offeringsData, updateMockVida, addMockVida, updateMockCellGroup, addMockCellGroup, addMockUser, updateMockUser, addMockOffering]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
