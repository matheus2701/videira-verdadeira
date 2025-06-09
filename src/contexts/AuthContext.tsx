
'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useMemo, useCallback } from 'react';
import type { User, Role, Vida, CellGroup, StoredOffering, OfferingFormValues, VidaStatus } from '@/types'; // Adicionado StoredOffering, OfferingFormValues

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loginAs: (role: Role) => void;
  logout: () => void;
  mockUsers: User[]; 
  mockVidas: Vida[];
  mockCellGroups: CellGroup[];
  mockOfferings: StoredOffering[];
  updateMockVida: (updatedVida: Vida) => void;
  addMockVida: (newVida: Vida) => void;
  updateMockCellGroup: (updatedCG: CellGroup, oldLiderVidaId?: string) => void; // Adicionado oldLiderVidaId opcional
  addMockCellGroup: (newCG: CellGroup) => void;
  addMockUser: (newUser: User) => void;
  updateMockUser: (updatedUser: User) => void;
  addMockOffering: (newOffering: OfferingFormValues) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data inicial para Vidas
const initialMockVidas: Vida[] = [
  { id: 'vida-lider-joao', nomeCompleto: 'Líder João', dataNascimento: new Date(1988, 2, 10), telefone: '(11) 91234-5678', idCelula: 'celula-discipulos-001', nomeCelula: 'Discípulos de Cristo', geracaoCelula: 'G1', status: 'lider_ativo', createdAt: new Date() },
  { id: 'vida-ana', nomeCompleto: 'Ana Silva (Membro)', dataNascimento: new Date(1990, 5, 15), idCelula: 'celula-discipulos-001', nomeCelula: 'Discípulos de Cristo', geracaoCelula: 'G1', status: 'membro', createdAt: new Date() },
  { id: 'vida-bruno', nomeCompleto: 'Bruno Costa (Outra Célula)', dataNascimento: new Date(1985, 8, 22), idCelula: 'celula-leoes-002', nomeCelula: 'Leões de Judá', geracaoCelula: 'G2', status: 'membro', createdAt: new Date() },
  { id: 'vida-carla', nomeCompleto: 'Carla Santos (Membro)', dataNascimento: new Date(1995, 10, 5), idCelula: 'celula-leoes-002', nomeCelula: 'Leões de Judá', geracaoCelula: 'G2', status: 'membro', createdAt: new Date() },
  { id: 'vida-sem-celula', nomeCompleto: 'Mariana Dias (Sem Célula)', dataNascimento: new Date(1992, 7, 12), telefone: '(11) 98888-7777', idCelula: '', nomeCelula: '', geracaoCelula: '', status: 'membro', createdAt: new Date() },
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
     {
      id: 'celula-nova-geracao-003',
      name: 'Nova Geração',
      address: 'Praça da Alegria, 789',
      meetingDay: 'Terça-feira',
      meetingTime: '18:00',
      geracao: 'G3',
      liderVidaId: undefined, // Sem líder inicialmente
      liderNome: undefined,
      meetingStatus: 'agendada',
      lastStatusUpdate: new Date(new Date().setDate(new Date().getDate() - 1)) 
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
  const [offeringsData, setOfferingsData] = useState<StoredOffering[]>(initialMockOfferings);

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

  const updateMockVida = useCallback((updatedVida: Vida) => {
    setVidasData(prev => prev.map(v => v.id === updatedVida.id ? updatedVida : v));
    
    // Se a vida atualizada é um líder, garantir que o CellGroup e o User associado reflitam isso.
    if (updatedVida.status === 'lider_ativo' || updatedVida.status === 'lider_em_treinamento') {
      if (updatedVida.idCelula) {
        setCellGroupsData(prevCGs => prevCGs.map(cg => {
          if (cg.id === updatedVida.idCelula) {
            return { ...cg, liderVidaId: updatedVida.id, liderNome: updatedVida.nomeCompleto };
          }
          // Se esta vida era líder de outra célula, desvinculá-la (simplificado)
          if (cg.liderVidaId === updatedVida.id && cg.id !== updatedVida.idCelula) {
            return { ...cg, liderVidaId: undefined, liderNome: undefined };
          }
          return cg;
        }));
      }
      setUsersData(prevUsers => prevUsers.map(u => {
        if (u.vidaId === updatedVida.id) {
          const updatedAuthUser = {
            ...u,
            role: 'lider_de_celula' as Role,
            cellGroupId: updatedVida.idCelula || undefined,
            cellGroupName: updatedVida.nomeCelula || undefined,
            name: updatedVida.nomeCompleto, // Sincronizar nome
          };
          if (user && user.id === u.id) {
            setUser(updatedAuthUser);
          }
          return updatedAuthUser;
        }
        return u;
      }));
    } else if (updatedVida.status === 'membro') { // Se a vida se tornou membro
       // Desvincular de qualquer liderança de célula
        setCellGroupsData(prevCGs => prevCGs.map(cg => {
          if (cg.liderVidaId === updatedVida.id) {
            return { ...cg, liderVidaId: undefined, liderNome: undefined };
          }
          return cg;
        }));
        // Atualizar o User associado, se houver, para não ser mais líder
        setUsersData(prevUsers => prevUsers.map(u => {
          if (u.vidaId === updatedVida.id && u.role === 'lider_de_celula') {
             const updatedAuthUser = {
                ...u,
                role: 'missionario' as Role, // Ou algum status padrão, ou remover cellGroupId/Name
                cellGroupId: undefined,
                cellGroupName: undefined,
             };
             // Por simplicidade, não redefinimos o papel para 'missionario' a menos que seja o comportamento desejado.
             // Idealmente, o User seria apenas desvinculado da célula como líder.
             // Para este mock, vamos apenas desvincular da célula no User.
             if (user && user.id === u.id) {
                setUser(prevUser => prevUser ? {...prevUser, cellGroupId: undefined, cellGroupName: undefined } : null);
             }
             return {...u, cellGroupId: undefined, cellGroupName: undefined};
          }
          return u;
        }));
    }
  }, [user]);

  const addMockVida = useCallback((newVida: Vida) => {
    setVidasData(prev => [newVida, ...prev]);
  }, []);

  const updateMockCellGroup = useCallback((updatedCG: CellGroup, oldLiderVidaId?: string) => {
    setCellGroupsData(prevCGs => {
      const newGroups = prevCGs.map(cg => cg.id === updatedCG.id ? updatedCG : cg);
      // Atualiza o nome da célula do líder logado, se aplicável
      if (user?.role === 'lider_de_celula' && user.cellGroupId === updatedCG.id && user.cellGroupName !== updatedCG.name) {
        setUser(prevUser => prevUser ? {...prevUser, cellGroupName: updatedCG.name} : null);
      }
      return newGroups;
    });

    if (updatedCG.liderVidaId) { // Se um novo líder foi atribuído à célula
      setVidasData(prevVidas => prevVidas.map(v => {
        if (v.id === updatedCG.liderVidaId) { // Atualiza a Vida do novo líder
          return {
            ...v,
            idCelula: updatedCG.id,
            nomeCelula: updatedCG.name,
            geracaoCelula: updatedCG.geracao,
            status: v.status !== 'lider_ativo' && v.status !== 'lider_em_treinamento' ? 'lider_ativo' as VidaStatus : v.status, // Promove a líder ativo se era membro
          };
        }
        return v;
      }));
      setUsersData(prevUsers => prevUsers.map(u => {
        if (u.vidaId === updatedCG.liderVidaId) { // Atualiza o User do novo líder
          const updatedAuthUser = {
            ...u,
            role: 'lider_de_celula' as Role,
            cellGroupId: updatedCG.id,
            cellGroupName: updatedCG.name,
            name: updatedCG.liderNome || u.name, // Atualiza nome do user com nome do lider
          };
          if (user && user.id === u.id) {
            setUser(updatedAuthUser);
          }
          return updatedAuthUser;
        }
        return u;
      }));
    }

    // Se havia um líder antigo e ele é diferente do novo, desvincula o antigo da célula.
    // A página `lideres/novo` já tem uma lógica mais completa para promoção/designação.
    // Esta parte em `updateMockCellGroup` é mais para quando um admin edita uma célula diretamente.
    if (oldLiderVidaId && oldLiderVidaId !== updatedCG.liderVidaId) {
        setVidasData(prevVidas => prevVidas.map(v => {
            if (v.id === oldLiderVidaId && v.idCelula === updatedCG.id) {
                // Apenas desvincula desta célula. Não muda status ou role globalmente aqui.
                // Isso pode ser refinado se um líder só puder liderar uma célula.
                return { ...v, idCelula: '', nomeCelula: '', geracaoCelula: '' };
            }
            return v;
        }));
        setUsersData(prevUsers => prevUsers.map(u => {
            if (u.vidaId === oldLiderVidaId && u.cellGroupId === updatedCG.id) {
                 const updatedAuthUser = { ...u, cellGroupId: undefined, cellGroupName: undefined };
                 // Se o usuário atual é o líder antigo, atualiza seu estado no AuthContext
                 if (user && user.id === u.id) {
                    setUser(updatedAuthUser);
                 }
                return updatedAuthUser;
            }
            return u;
        }));
    }

  }, [user]);

  const addMockCellGroup = useCallback((newCG: CellGroup) => {
    setCellGroupsData(prev => [newCG, ...prev]);
  }, []);

  const addMockUser = useCallback((newUser: User) => {
    setUsersData(prev => {
      const existingUserIndex = prev.findIndex(u => u.vidaId && newUser.vidaId && u.vidaId === newUser.vidaId);
      if (existingUserIndex !== -1) {
        const updatedUsers = [...prev];
        updatedUsers[existingUserIndex] = newUser;
        if (user && user.id === updatedUsers[existingUserIndex].id) { // Se o usuário logado foi atualizado
          setUser(newUser);
        }
        return updatedUsers;
      }
      return [newUser, ...prev];
    });
  }, [user]);

  const updateMockUser = useCallback((updatedUser: User) => {
    setUsersData(prev => prev.map(u => {
      if (u.id === updatedUser.id) {
        if (user && user.id === updatedUser.id) { // Se o usuário logado foi atualizado
          setUser(updatedUser);
        }
        return updatedUser;
      }
      return u;
    }));
  }, [user]);

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
    mockOfferings: offeringsData,
    updateMockVida,
    addMockVida,
    updateMockCellGroup,
    addMockCellGroup,
    addMockUser,
    updateMockUser,
    addMockOffering,
  }), [user, loginAs, logout, usersData, vidasData, cellGroupsData, offeringsData, updateMockVida, addMockVida, updateMockCellGroup, addMockCellGroup, addMockUser, updateMockUser, addMockOffering]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

