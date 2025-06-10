
'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useMemo, useCallback } from 'react';
import type { User, Role, Vida, CellGroup, StoredOffering, OfferingFormValues, VidaStatus, PeaceHouse, PeaceHouseFormValues, Lesson } from '@/types';
import { getDefaultLessons } from '@/types'; // Importar utilitário de lições

// Nova interface para permissões globais da aplicação (mock)
interface AppPermissions {
  liderPodeVerRelatorios: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loginAs: (role: Role) => void;
  logout: () => void;
  mockUsers: User[];
  mockVidas: Vida[];
  mockCellGroups: CellGroup[];
  mockOfferings: StoredOffering[];
  mockPeaceHouses: PeaceHouse[]; // Adicionado
  updateMockVida: (updatedVida: Vida) => void;
  addMockVida: (newVida: Vida) => void;
  updateMockCellGroup: (updatedCG: CellGroup, oldLiderVidaId?: string) => void;
  addMockCellGroup: (newCG: CellGroup) => void;
  addMockUser: (newUser: User) => void;
  updateMockUser: (updatedUser: User) => void;
  addMockOffering: (newOffering: OfferingFormValues) => void;
  addMockPeaceHouse: (newPeaceHouseData: PeaceHouseFormValues) => void; // Adicionado
  updateMockPeaceHouse: (updatedPeaceHouse: PeaceHouse) => void; // Adicionado
  toggleUserActiveStatus: (userId: string) => void;
  appPermissions: AppPermissions;
  toggleLiderPodeVerRelatorios: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data inicial para Vidas
const initialMockVidas: Vida[] = [
  { id: 'vida-lider-joao', nomeCompleto: 'Líder João', dataNascimento: new Date(1988, 2, 10), telefone: '(11) 91234-5678', idCelula: 'celula-discipulos-001', nomeCelula: 'Discípulos de Cristo', geracaoCelula: 'G1', status: 'lider_ativo', createdAt: new Date() },
  { id: 'vida-ana', nomeCompleto: 'Ana Silva (Membro)', dataNascimento: new Date(1990, 5, 15), idCelula: 'celula-discipulos-001', nomeCelula: 'Discípulos de Cristo', geracaoCelula: 'G1', status: 'membro', createdAt: new Date() },
  { id: 'vida-bruno', nomeCompleto: 'Bruno Costa (Outra Célula)', dataNascimento: new Date(1985, 8, 22), idCelula: 'celula-leoes-002', nomeCelula: 'Leões de Judá', geracaoCelula: 'G2', status: 'membro', createdAt: new Date() },
  { id: 'vida-carla', nomeCompleto: 'Carla Santos (Membro)', dataNascimento: new Date(1995, 10, 5), idCelula: 'celula-leoes-002', nomeCelula: 'Leões de Judá', geracaoCelula: 'G2', status: 'membro', createdAt: new Date() },
  { id: 'vida-sem-celula', nomeCompleto: 'Mariana Dias (Sem Célula)', dataNascimento: new Date(1992, 7, 12), telefone: '(11) 98888-7777', idCelula: '', nomeCelula: '', geracaoCelula: '', status: 'membro', createdAt: new Date() },
  { id: 'vida-pedro', nomeCompleto: 'Pedro Álvares (Para Promover)', dataNascimento: new Date(1993, 4, 20), telefone: '(21) 99999-8888', idCelula: 'celula-leoes-002', nomeCelula: 'Leões de Judá', geracaoCelula: 'G2', status: 'membro', createdAt: new Date() },
  { id: 'vida-lucia', nomeCompleto: 'Lúcia Ferreira (Treinamento)', dataNascimento: new Date(1980, 1, 1), telefone: '(31) 91111-2222', idCelula: 'celula-nova-geracao-003', nomeCelula: 'Nova Geração', geracaoCelula: 'G3', status: 'lider_em_treinamento', createdAt: new Date() },
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
      liderVidaId: 'vida-lucia',
      liderNome: 'Lúcia Ferreira',
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
  isActive: true,
};

const mockLiderUserInitial: User = {
  id: 'user-lider-joao-01',
  name: 'Líder João',
  email: 'lider.joao@videira.app',
  role: 'lider_de_celula',
  vidaId: 'vida-lider-joao',
  cellGroupId: 'celula-discipulos-001',
  cellGroupName: 'Discípulos de Cristo',
  isActive: true,
};
const mockLiderLuciaUser: User = {
    id: 'user-lider-lucia-02',
    name: 'Lúcia Ferreira',
    email: 'lucia.ferreira@videira.app',
    role: 'lider_de_celula',
    vidaId: 'vida-lucia',
    cellGroupId: 'celula-nova-geracao-003',
    cellGroupName: 'Nova Geração',
    isActive: true,
}

const initialMockUsers: User[] = [mockMissionario, mockLiderUserInitial, mockLiderLuciaUser];

// Mock data inicial para Ofertas
const currentYear = new Date().getFullYear();
const initialMockOfferings: StoredOffering[] = [
  { id: "off1", amount: 50, date: new Date(2024, 5, 5), cellGroupName: "Discípulos de Cristo", notes: "Oferta semanal" },
  { id: "off2", amount: 75, date: new Date(2024, 5, 12), cellGroupName: "Leões de Judá", notes: "Culto de domingo" },
  { id: "off3", amount: 60, date: new Date(2024, 6, 3), cellGroupName: "Discípulos de Cristo" },
  { id: "off4", amount: 100, date: new Date(2024, 6, 10), cellGroupName: "Leões de Judá", notes: "Oferta especial" },
  { id: "off5", amount: 40, date: new Date(2024, 6, 17), cellGroupName: "Discípulos de Cristo", notes: "Para missões" },
  { id: "off6", amount: 80, date: new Date(currentYear, new Date().getMonth(), 1), cellGroupName: "Nova Geração", notes: "Oferta deste mês" },
  { id: "off7", amount: 120, date: new Date(currentYear, new Date().getMonth() -1, 15), cellGroupName: "Discípulos de Cristo", notes: "Oferta do mês passado" },
];

// Mock data inicial para Casas de Paz (vazio por padrão, será populado via UI)
const initialMockPeaceHouses: PeaceHouse[] = [];


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockMissionario);
  const [vidasData, setVidasData] = useState<Vida[]>(initialMockVidas);
  const [cellGroupsData, setCellGroupsData] = useState<CellGroup[]>(initialMockCellGroups);
  const [usersData, setUsersData] = useState<User[]>(initialMockUsers);
  const [offeringsData, setOfferingsData] = useState<StoredOffering[]>(initialMockOfferings);
  const [peaceHousesData, setPeaceHousesData] = useState<PeaceHouse[]>(initialMockPeaceHouses); // Estado para Casas de Paz
  const [appPermissions, setAppPermissions] = useState<AppPermissions>({ liderPodeVerRelatorios: false });

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

    if (updatedVida.status === 'lider_ativo' || updatedVida.status === 'lider_em_treinamento') {
      if (updatedVida.idCelula) {
        setCellGroupsData(prevCGs => prevCGs.map(cg => {
          if (cg.id === updatedVida.idCelula) {
            return { ...cg, liderVidaId: updatedVida.id, liderNome: updatedVida.nomeCompleto };
          }
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
            name: updatedVida.nomeCompleto,
          };
          if (user && user.id === u.id) {
            setUser(updatedAuthUser);
          }
          return updatedAuthUser;
        }
        return u;
      }));
    } else if (updatedVida.status === 'membro') {
        setCellGroupsData(prevCGs => prevCGs.map(cg => {
          if (cg.liderVidaId === updatedVida.id) {
            return { ...cg, liderVidaId: undefined, liderNome: undefined };
          }
          return cg;
        }));
        setUsersData(prevUsers => prevUsers.map(u => {
          if (u.vidaId === updatedVida.id && u.role === 'lider_de_celula') {
             const updatedAuthUser = {...u, cellGroupId: undefined, cellGroupName: undefined};
             if (user && user.id === u.id) {
                setUser(prevUser => prevUser ? {...prevUser, cellGroupId: undefined, cellGroupName: undefined } : null);
             }
             return updatedAuthUser;
          }
          return u;
        }));
    }
  }, [user]);

  const addMockVida = useCallback((newVida: Vida) => {
    setVidasData(prev => [{...newVida, createdAt: newVida.createdAt || new Date()}, ...prev]);
  }, []);

  const updateMockCellGroup = useCallback((updatedCG: CellGroup, oldLiderVidaId?: string) => {
    setCellGroupsData(prevCGs => prevCGs.map(cg => cg.id === updatedCG.id ? updatedCG : cg));

    if (updatedCG.liderVidaId) {
      setVidasData(prevVidas => prevVidas.map(v => {
        if (v.id === updatedCG.liderVidaId) {
          return {
            ...v,
            idCelula: updatedCG.id,
            nomeCelula: updatedCG.name,
            geracaoCelula: updatedCG.geracao,
            status: v.status !== 'lider_ativo' && v.status !== 'lider_em_treinamento' ? 'lider_ativo' as VidaStatus : v.status,
          };
        }
        return v;
      }));
      setUsersData(prevUsers => {
        const existingUser = prevUsers.find(u => u.vidaId === updatedCG.liderVidaId);
        if (existingUser) {
          return prevUsers.map(u => {
            if (u.vidaId === updatedCG.liderVidaId) {
              const updatedAuthUser = {
                ...u,
                role: 'lider_de_celula' as Role,
                cellGroupId: updatedCG.id,
                cellGroupName: updatedCG.name,
                name: updatedCG.liderNome || u.name,
                isActive: u.isActive === undefined ? true : u.isActive,
              };
              if (user && user.id === u.id) {
                setUser(updatedAuthUser);
              }
              return updatedAuthUser;
            }
            return u;
          });
        } else { // Se o User não existe para o novo líder, cria um
          const newLiderUser: User = {
            id: `user-${updatedCG.liderVidaId}-${Date.now()}`,
            name: updatedCG.liderNome || 'Nome do Líder',
            email: `${(updatedCG.liderNome || 'lider').toLowerCase().replace(/\s+/g, '.')}@videira.app`,
            role: 'lider_de_celula',
            vidaId: updatedCG.liderVidaId,
            cellGroupId: updatedCG.id,
            cellGroupName: updatedCG.name,
            isActive: true,
          };
          // Se o usuário logado é este novo líder (improvável neste fluxo, mas para segurança)
          if (user && user.vidaId === newLiderUser.vidaId) {
             setUser(newLiderUser);
          }
          return [...prevUsers, newLiderUser];
        }
      });
    }

    if (oldLiderVidaId && oldLiderVidaId !== updatedCG.liderVidaId) {
        setVidasData(prevVidas => prevVidas.map(v => {
            if (v.id === oldLiderVidaId && v.idCelula === updatedCG.id) {
                return { ...v, idCelula: '', nomeCelula: '', geracaoCelula: '' };
            }
            return v;
        }));
        setUsersData(prevUsers => prevUsers.map(u => {
            if (u.vidaId === oldLiderVidaId && u.cellGroupId === updatedCG.id) {
                 const updatedAuthUser = { ...u, cellGroupId: undefined, cellGroupName: undefined };
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
    setCellGroupsData(prev => [{...newCG, lastStatusUpdate: newCG.lastStatusUpdate || new Date()}, ...prev]);
    if (newCG.liderVidaId) {
        updateMockCellGroup(newCG);
    }
  }, [updateMockCellGroup]);

  const addMockUser = useCallback((newUser: User) => {
    setUsersData(prev => {
      const existingUserIndex = prev.findIndex(u => u.vidaId && newUser.vidaId && u.vidaId === newUser.vidaId);
      if (existingUserIndex !== -1) {
        const updatedUsers = [...prev];
        updatedUsers[existingUserIndex] = {...updatedUsers[existingUserIndex], ...newUser, isActive: newUser.isActive ?? updatedUsers[existingUserIndex].isActive ?? true};
        if (user && user.id === updatedUsers[existingUserIndex].id) {
          setUser(updatedUsers[existingUserIndex]);
        }
        return updatedUsers;
      }
      return [{...newUser, isActive: newUser.isActive ?? true}, ...prev];
    });
  }, [user]);

  const updateMockUser = useCallback((updatedUser: User) => {
    setUsersData(prev => prev.map(u => {
      if (u.id === updatedUser.id) {
        const mergedUser = {...u, ...updatedUser, isActive: updatedUser.isActive ?? u.isActive ?? true };
        if (user && user.id === updatedUser.id) {
          setUser(mergedUser);
        }
        return mergedUser;
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

  const toggleUserActiveStatus = useCallback((userId: string) => {
    setUsersData(prevUsers =>
      prevUsers.map(u => {
        if (u.id === userId) {
          const newActiveStatus = u.isActive === undefined ? false : !u.isActive;
          const updatedUser = { ...u, isActive: newActiveStatus };
          if (user && user.id === userId) {
            setUser(updatedUser);
          }
          return updatedUser;
        }
        return u;
      })
    );
  }, [user]);

  const toggleLiderPodeVerRelatorios = useCallback(() => {
    setAppPermissions(prev => ({ ...prev, liderPodeVerRelatorios: !prev.liderPodeVerRelatorios }));
  }, []);

  // Funções para Casas de Paz
  const addMockPeaceHouse = useCallback((newPeaceHouseData: PeaceHouseFormValues) => {
    const newPeaceHouse: PeaceHouse = {
      id: `ph-${Date.now()}`,
      ...newPeaceHouseData,
      createdAt: new Date(),
      lessonsProgress: getDefaultLessons(),
      isCompleted: false,
    };
    setPeaceHousesData(prev => [newPeaceHouse, ...prev]);
  }, []);

  const updateMockPeaceHouse = useCallback((updatedPeaceHouse: PeaceHouse) => {
    setPeaceHousesData(prev => prev.map(ph => ph.id === updatedPeaceHouse.id ? updatedPeaceHouse : ph));
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
    mockPeaceHouses: peaceHousesData, // Expor
    updateMockVida,
    addMockVida,
    updateMockCellGroup,
    addMockCellGroup,
    addMockUser,
    updateMockUser,
    addMockOffering,
    addMockPeaceHouse, // Expor
    updateMockPeaceHouse, // Expor
    toggleUserActiveStatus,
    appPermissions,
    toggleLiderPodeVerRelatorios,
  }), [user, loginAs, logout, usersData, vidasData, cellGroupsData, offeringsData, peaceHousesData, updateMockVida, addMockVida, updateMockCellGroup, addMockCellGroup, addMockUser, updateMockUser, addMockOffering, addMockPeaceHouse, updateMockPeaceHouse, toggleUserActiveStatus, appPermissions, toggleLiderPodeVerRelatorios]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
