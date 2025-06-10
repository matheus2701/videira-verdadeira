
'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useMemo, useCallback } from 'react';
import type { User, Role, Vida, CellGroup, StoredOffering, OfferingFormValues, VidaStatus } from '@/types';

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
  updateMockVida: (updatedVida: Vida) => void;
  addMockVida: (newVida: Vida) => void;
  updateMockCellGroup: (updatedCG: CellGroup, oldLiderVidaId?: string) => void;
  addMockCellGroup: (newCG: CellGroup) => void;
  addMockUser: (newUser: User) => void;
  updateMockUser: (updatedUser: User) => void;
  addMockOffering: (newOffering: OfferingFormValues) => void;
  toggleUserActiveStatus: (userId: string) => void;
  appPermissions: AppPermissions; // Adicionado
  toggleLiderPodeVerRelatorios: () => void; // Adicionado
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


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockMissionario);
  const [vidasData, setVidasData] = useState<Vida[]>(initialMockVidas);
  const [cellGroupsData, setCellGroupsData] = useState<CellGroup[]>(initialMockCellGroups);
  const [usersData, setUsersData] = useState<User[]>(initialMockUsers);
  const [offeringsData, setOfferingsData] = useState<StoredOffering[]>(initialMockOfferings);
  const [appPermissions, setAppPermissions] = useState<AppPermissions>({ liderPodeVerRelatorios: false }); // Estado para permissões

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

    // Se a Vida atualizada for um líder, sincronize com CellGroups e Users
    if (updatedVida.status === 'lider_ativo' || updatedVida.status === 'lider_em_treinamento') {
      // Atualiza a célula que esta Vida lidera
      if (updatedVida.idCelula) {
        setCellGroupsData(prevCGs => prevCGs.map(cg => {
          // Se esta célula é a que a Vida atualizada lidera
          if (cg.id === updatedVida.idCelula) {
            return { ...cg, liderVidaId: updatedVida.id, liderNome: updatedVida.nomeCompleto };
          }
          // Se esta célula era liderada pela Vida atualizada, mas agora a Vida lidera outra célula
          if (cg.liderVidaId === updatedVida.id && cg.id !== updatedVida.idCelula) {
            return { ...cg, liderVidaId: undefined, liderNome: undefined }; // Remove o líder
          }
          return cg;
        }));
      }
      // Atualiza ou cria o User correspondente
      setUsersData(prevUsers => prevUsers.map(u => {
        if (u.vidaId === updatedVida.id) {
          const updatedAuthUser = {
            ...u,
            role: 'lider_de_celula' as Role, // Garante o papel correto
            cellGroupId: updatedVida.idCelula || undefined,
            cellGroupName: updatedVida.nomeCelula || undefined,
            name: updatedVida.nomeCompleto, // Sincroniza nome
          };
          // Se o usuário atual é o que está sendo modificado, atualiza o estado do usuário logado
          if (user && user.id === u.id) {
            setUser(updatedAuthUser);
          }
          return updatedAuthUser;
        }
        return u;
      }));
    } else if (updatedVida.status === 'membro') {
        // Se a Vida foi rebaixada para membro, remove-a como líder de qualquer célula
        setCellGroupsData(prevCGs => prevCGs.map(cg => {
          if (cg.liderVidaId === updatedVida.id) {
            return { ...cg, liderVidaId: undefined, liderNome: undefined };
          }
          return cg;
        }));
        // E atualiza o usuário para não ter mais cellGroupId/cellGroupName (se era líder)
        setUsersData(prevUsers => prevUsers.map(u => {
          if (u.vidaId === updatedVida.id && u.role === 'lider_de_celula') {
             // Não muda o role aqui, apenas desvincula da célula. O role seria mudado em outro fluxo, se necessário.
             const updatedAuthUser = {...u, cellGroupId: undefined, cellGroupName: undefined};
             if (user && user.id === u.id) { // Se for o usuário logado
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

    // Se um novo líder foi definido para updatedCG
    if (updatedCG.liderVidaId) {
      // Atualiza a Vida do novo líder para refletir a associação com esta célula
      setVidasData(prevVidas => prevVidas.map(v => {
        if (v.id === updatedCG.liderVidaId) {
          return {
            ...v,
            idCelula: updatedCG.id,
            nomeCelula: updatedCG.name,
            geracaoCelula: updatedCG.geracao,
            // Garante que o status seja de liderança, se não for.
            status: v.status !== 'lider_ativo' && v.status !== 'lider_em_treinamento' ? 'lider_ativo' as VidaStatus : v.status,
          };
        }
        return v;
      }));
      // Atualiza o User do novo líder
      setUsersData(prevUsers => prevUsers.map(u => {
        if (u.vidaId === updatedCG.liderVidaId) {
          const updatedAuthUser = {
            ...u,
            role: 'lider_de_celula' as Role,
            cellGroupId: updatedCG.id,
            cellGroupName: updatedCG.name,
            name: updatedCG.liderNome || u.name, // Atualiza o nome do User com o nome do líder da célula
            isActive: u.isActive === undefined ? true : u.isActive, // Garante que está ativo
          };
          // Se o usuário logado é este novo líder, atualiza o estado do usuário logado
          if (user && user.id === u.id) {
            setUser(updatedAuthUser);
          }
          return updatedAuthUser;
        }
        return u;
      }));
    }

    // Se havia um líder antigo e ele é diferente do novo líder (ou se o novo líder é undefined)
    if (oldLiderVidaId && oldLiderVidaId !== updatedCG.liderVidaId) {
        // Remove a célula da Vida do líder antigo
        setVidasData(prevVidas => prevVidas.map(v => {
            if (v.id === oldLiderVidaId && v.idCelula === updatedCG.id) {
                return { ...v, idCelula: '', nomeCelula: '', geracaoCelula: '' }; // Remove da célula
            }
            return v;
        }));
        // Remove a célula do User do líder antigo
        setUsersData(prevUsers => prevUsers.map(u => {
            if (u.vidaId === oldLiderVidaId && u.cellGroupId === updatedCG.id) {
                 const updatedAuthUser = { ...u, cellGroupId: undefined, cellGroupName: undefined };
                 if (user && user.id === u.id) { // Se o usuário logado for o líder antigo
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
    // Se um líder foi atribuído na criação da célula, precisamos atualizar a Vida e o User desse líder.
    if (newCG.liderVidaId) {
        updateMockCellGroup(newCG); // Chama update para lidar com a lógica de atribuição do líder
    }
  }, [updateMockCellGroup]);

  const addMockUser = useCallback((newUser: User) => {
    setUsersData(prev => {
      // Verifica se já existe um usuário com o mesmo vidaId para evitar duplicatas de User para a mesma Vida
      const existingUserIndex = prev.findIndex(u => u.vidaId && newUser.vidaId && u.vidaId === newUser.vidaId);
      if (existingUserIndex !== -1) {
        // Se existe, atualiza o usuário existente
        const updatedUsers = [...prev];
        updatedUsers[existingUserIndex] = {...updatedUsers[existingUserIndex], ...newUser, isActive: newUser.isActive ?? updatedUsers[existingUserIndex].isActive ?? true};
        // Se o usuário atualizado é o usuário logado, atualiza o estado do usuário logado
        if (user && user.id === updatedUsers[existingUserIndex].id) {
          setUser(updatedUsers[existingUserIndex]);
        }
        return updatedUsers;
      }
      // Se não existe, adiciona o novo usuário
      return [{...newUser, isActive: newUser.isActive ?? true}, ...prev];
    });
  }, [user]);

  const updateMockUser = useCallback((updatedUser: User) => {
    setUsersData(prev => prev.map(u => {
      if (u.id === updatedUser.id) {
        const mergedUser = {...u, ...updatedUser, isActive: updatedUser.isActive ?? u.isActive ?? true };
        // Se o usuário atualizado é o usuário logado, atualiza o estado do usuário logado
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
          const newActiveStatus = u.isActive === undefined ? false : !u.isActive; // Default to active if undefined, then toggle
          const updatedUser = { ...u, isActive: newActiveStatus };
          if (user && user.id === userId) { // Se o usuário logado é o que está sendo alterado
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
    toggleUserActiveStatus,
    appPermissions, // Expor permissões
    toggleLiderPodeVerRelatorios, // Expor função de toggle
  }), [user, loginAs, logout, usersData, vidasData, cellGroupsData, offeringsData, updateMockVida, addMockVida, updateMockCellGroup, addMockCellGroup, addMockUser, updateMockUser, addMockOffering, toggleUserActiveStatus, appPermissions, toggleLiderPodeVerRelatorios]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
