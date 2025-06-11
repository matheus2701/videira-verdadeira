
'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { User, Role, Vida, CellGroup, StoredOffering, OfferingFormValues, VidaStatus, PeaceHouse, PeaceHouseFormValues, Lesson } from '@/types';
import { getDefaultLessons } from '@/types';
import { supabase } from '@/lib/supabaseClient'; // Importar Supabase client
import type { AuthChangeEvent, Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';

interface AppPermissions {
  liderPodeVerRelatorios: boolean;
}

interface GeracaoVideiraConfig {
  description: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void; // Manter para compatibilidade, mas Supabase gerencia a sessão
  loginWithEmail: (email: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  simulateLoginByRole: (role: Role) => void; // Pode ser removido ou adaptado
  mockUsers: User[];
  mockVidas: Vida[];
  mockCellGroups: CellGroup[];
  mockOfferings: StoredOffering[];
  mockPeaceHouses: PeaceHouse[];
  updateMockVida: (updatedVida: Vida) => void;
  addMockVida: (newVida: Vida) => void;
  updateMockCellGroup: (updatedCG: CellGroup, oldLiderVidaId?: string) => void;
  addMockCellGroup: (newCG: CellGroup) => void;
  addMockUser: (newUser: User) => void;
  updateMockUser: (updatedUser: User) => void;
  addMockOffering: (newOffering: OfferingFormValues) => void;
  addMockPeaceHouse: (newPeaceHouseData: PeaceHouseFormValues) => void;
  updateMockPeaceHouse: (updatedPeaceHouse: PeaceHouse) => void;
  toggleUserActiveStatus: (userId: string) => void;
  appPermissions: AppPermissions;
  toggleLiderPodeVerRelatorios: () => void;
  geracaoVideiraConfig: GeracaoVideiraConfig;
  setGeracaoVideiraDescription: (description: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dados mock permanecerão por enquanto para outras funcionalidades não migradas
const initialMockVidas: Vida[] = [
  { id: 'vida-lider-joao', nomeCompleto: 'Líder João', dataNascimento: new Date(1988, 2, 10), telefone: '(11) 91234-5678', idCelula: 'celula-discipulos-001', nomeCelula: 'Discípulos de Cristo', geracaoCelula: 'G1', status: 'lider_ativo', createdAt: new Date() },
  { id: 'vida-ana', nomeCompleto: 'Ana Silva (Membro)', dataNascimento: new Date(1990, 5, 15), idCelula: 'celula-discipulos-001', nomeCelula: 'Discípulos de Cristo', geracaoCelula: 'G1', status: 'membro', createdAt: new Date() },
  { id: 'vida-bruno', nomeCompleto: 'Bruno Costa (Outra Célula)', dataNascimento: new Date(1985, 8, 22), idCelula: 'celula-leoes-002', nomeCelula: 'Leões de Judá', geracaoCelula: 'G2', status: 'membro', createdAt: new Date() },
  { id: 'vida-carla', nomeCompleto: 'Carla Santos (Membro)', dataNascimento: new Date(1995, 10, 5), idCelula: 'celula-leoes-002', nomeCelula: 'Leões de Judá', geracaoCelula: 'G2', status: 'membro', createdAt: new Date() },
  { id: 'vida-sem-celula', nomeCompleto: 'Mariana Dias (Sem Célula)', dataNascimento: new Date(1992, 7, 12), telefone: '(11) 98888-7777', idCelula: '', nomeCelula: '', geracaoCelula: '', status: 'membro', createdAt: new Date() },
  { id: 'vida-pedro', nomeCompleto: 'Pedro Álvares (Para Promover)', dataNascimento: new Date(1993, 4, 20), telefone: '(21) 99999-8888', idCelula: 'celula-leoes-002', nomeCelula: 'Leões de Judá', geracaoCelula: 'G2', status: 'membro', createdAt: new Date() },
  { id: 'vida-lucia', nomeCompleto: 'Lúcia Ferreira (Treinamento)', dataNascimento: new Date(1980, 1, 1), telefone: '(31) 91111-2222', idCelula: 'celula-nova-geracao-003', nomeCelula: 'Nova Geração', geracaoCelula: 'G3', status: 'lider_em_treinamento', createdAt: new Date() },
];

const initialMockCellGroups: CellGroup[] = [
    { id: 'celula-discipulos-001', name: 'Discípulos de Cristo', address: 'Rua da Fé, 123', meetingDay: 'Quarta-feira', meetingTime: '19:30', geracao: 'G1', liderVidaId: 'vida-lider-joao', liderNome: 'Líder João', meetingStatus: 'aconteceu', lastStatusUpdate: new Date(new Date().setDate(new Date().getDate() - 2)) },
    { id: 'celula-leoes-002', name: 'Leões de Judá', address: 'Av. Esperança, 456', meetingDay: 'Quinta-feira', meetingTime: '20:00', geracao: 'G2', meetingStatus: 'agendada', lastStatusUpdate: new Date(new Date().setDate(new Date().getDate() - 7)) },
    { id: 'celula-nova-geracao-003', name: 'Nova Geração', address: 'Praça da Alegria, 789', meetingDay: 'Terça-feira', meetingTime: '18:00', geracao: 'G3', liderVidaId: 'vida-lucia', liderNome: 'Lúcia Ferreira', meetingStatus: 'agendada', lastStatusUpdate: new Date(new Date().setDate(new Date().getDate() - 1)) },
];

const mockMissionarioUser: User = {
  id: 'user-missionario-01', // Este ID será do Supabase após cadastro
  name: 'Admin Missionário',
  email: 'matheus.santos01@gmail.com',
  role: 'missionario',
  isActive: true,
};

const mockLiderUserInitial: User = {
  id: 'user-lider-joao-01', // Este ID será do Supabase após cadastro
  name: 'Líder João',
  email: 'lider.joao@videira.app',
  role: 'lider_de_celula',
  vidaId: 'vida-lider-joao',
  cellGroupId: 'celula-discipulos-001',
  cellGroupName: 'Discípulos de Cristo',
  isActive: true,
};
const mockLiderLuciaUser: User = {
    id: 'user-lider-lucia-02', // Este ID será do Supabase após cadastro
    name: 'Lúcia Ferreira',
    email: 'lucia.ferreira@videira.app',
    role: 'lider_de_celula',
    vidaId: 'vida-lucia',
    cellGroupId: 'celula-nova-geracao-003',
    cellGroupName: 'Nova Geração',
    isActive: true,
}

const initialMockUsers: User[] = [mockMissionarioUser, mockLiderUserInitial, mockLiderLuciaUser];

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

const initialMockPeaceHouses: PeaceHouse[] = [];
const defaultGeracaoVideiraDescription = `A Geração Videira Verdadeira representa o compromisso com a formação de discípulos
segundo os ensinamentos de Cristo, cultivando líderes e membros que frutificam
em amor, serviço e fé. Sob a liderança e visão missionária, buscamos expandir
o Reino de Deus, célula por célula, vida por vida.`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // Para saber quando o onAuthStateChange inicial concluiu

  // Os dados mock permanecem para funcionalidades que ainda não usam Supabase
  const [vidasData, setVidasData] = useState<Vida[]>(initialMockVidas);
  const [cellGroupsData, setCellGroupsData] = useState<CellGroup[]>(initialMockCellGroups);
  const [usersData, setUsersData] = useState<User[]>(initialMockUsers); // Pode ser usado para exibir lista de usuários, etc.
  const [offeringsData, setOfferingsData] = useState<StoredOffering[]>(initialMockOfferings);
  const [peaceHousesData, setPeaceHousesData] = useState<PeaceHouse[]>(initialMockPeaceHouses);
  const [appPermissions, setAppPermissions] = useState<AppPermissions>({ liderPodeVerRelatorios: false });
  const [geracaoVideiraConfig, setGeracaoVideiraConfigState] = useState<GeracaoVideiraConfig>({ description: defaultGeracaoVideiraDescription });

  // Listener para o estado de autenticação do Supabase
  useEffect(() => {
    setLoadingAuth(true);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: SupabaseSession | null) => {
        const supabaseUser = session?.user;
        if (supabaseUser) {
          // TODO: Buscar perfil do usuário na tabela 'profiles' do Supabase
          // Por agora, usaremos dados limitados do Supabase auth
          // e tentaremos encontrar um perfil mock para simular.
          let appUser: User = {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            // Campos como name, role, isActive, cellGroupId virão da tabela 'profiles'
            // Provisoriamente, podemos tentar encontrar no mockUsers ou deixar undefined:
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email, // Exemplo
            role: 'lider_de_celula', // Default temporário
            isActive: true, // Default temporário
          };

          // Tentativa de carregar dados do mock para simular um perfil completo (REMOVER QUANDO TIVER PERFIS NO SUPABASE)
          const matchingMockUser = initialMockUsers.find(mu => mu.email.toLowerCase() === (supabaseUser.email || '').toLowerCase());
          if (matchingMockUser) {
            appUser = {
              ...appUser, // Mantém ID e email do Supabase
              name: matchingMockUser.name || appUser.name,
              role: matchingMockUser.role || appUser.role,
              vidaId: matchingMockUser.vidaId,
              cellGroupId: matchingMockUser.cellGroupId,
              cellGroupName: matchingMockUser.cellGroupName,
              isActive: matchingMockUser.isActive !== undefined ? matchingMockUser.isActive : true,
            };
          }
          
          setUserState(appUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('authUser', JSON.stringify(appUser));
          }
        } else {
          setUserState(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authUser');
          }
        }
        setLoadingAuth(false);
      }
    );

    // Carregar usuário do localStorage na inicialização (se Supabase ainda não respondeu)
    // O onAuthStateChange deve prevalecer.
    if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser && !user) { // apenas se Supabase ainda não setou um usuário
            try {
                const parsedUser = JSON.parse(storedUser);
                // Verificar se a sessão Supabase ainda é válida seria ideal aqui,
                // mas onAuthStateChange deve lidar com isso.
                setUserState(parsedUser);
            } catch (error) {
                console.error("Failed to parse authUser from localStorage", error);
                localStorage.removeItem('authUser');
            }
        }
    }


    return () => {
      authListener?.unsubscribe();
    };
  }, []); // Roda uma vez na montagem

  // Carregar outras configurações do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPermissions = localStorage.getItem('appPermissions');
      if (storedPermissions) {
        try {
          setAppPermissions(JSON.parse(storedPermissions));
        } catch (error) {
          console.error("Failed to parse appPermissions from localStorage", error);
        }
      }
      const storedGeracaoConfig = localStorage.getItem('geracaoVideiraConfig');
      if (storedGeracaoConfig) {
        try {
          setGeracaoVideiraConfigState(JSON.parse(storedGeracaoConfig));
        } catch (error) {
          console.error("Failed to parse geracaoVideiraConfig from localStorage", error);
          setGeracaoVideiraConfigState({ description: defaultGeracaoVideiraDescription });
        }
      }
    }
  }, []);


  // Função setUser para uso interno, se necessário, mas preferir que onAuthStateChange dite o estado.
  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
    if (typeof window !== 'undefined') {
      if (newUser) {
        localStorage.setItem('authUser', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('authUser');
      }
    }
  }, []);


  const loginWithEmail = useCallback(async (email: string, password?: string): Promise<boolean> => {
    if (!password) {
      console.error("Senha é obrigatória para login com Supabase.");
      return false;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Erro de login com Supabase:", error.message);
      return false;
    }
    
    if (data.user) {
      // onAuthStateChange deve cuidar de setar o usuário no estado.
      // Aqui, precisamos buscar o perfil para verificar 'isActive'.
      // Este é um passo ADICIONAL que faremos quando tivermos a tabela 'profiles'.
      // Por agora, o login do Supabase é suficiente se não houver erro.
      // A verificação 'isActive' virá da tabela de perfis.
      // Exemplo futuro:
      // const { data: profile, error: profileError } = await supabase
      //   .from('profiles')
      //   .select('isActive')
      //   .eq('id', data.user.id)
      //   .single();
      // if (profileError || !profile || !profile.isActive) {
      //   await supabase.auth.signOut(); // Desloga se perfil não encontrado ou inativo
      //   console.warn("Usuário inativo ou perfil não encontrado.");
      //   return false;
      // }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao fazer logout com Supabase:", error.message);
    }
    // onAuthStateChange deve limpar o usuário do estado.
    setUserState(null); // Limpa localmente também
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authUser');
    }
  }, []);

  const setGeracaoVideiraDescription = useCallback((description: string) => {
    const newConfig = { description };
    setGeracaoVideiraConfigState(newConfig);
    if (typeof window !== 'undefined') {
      localStorage.setItem('geracaoVideiraConfig', JSON.stringify(newConfig));
    }
  }, []);

  // Funções MOCK (manter por enquanto para partes não migradas)
  const simulateLoginByRole = useCallback((role: Role) => {
    let userToLogin: User | undefined;
    if (role === 'missionario') {
      userToLogin = usersData.find(u => u.email === 'matheus.santos01@gmail.com');
    } else {
      userToLogin = usersData.find(u => u.role === 'lider_de_celula' && u.vidaId === 'vida-lider-joao' && u.isActive);
      if (!userToLogin) {
        userToLogin = usersData.find(u => u.role === 'lider_de_celula' && u.isActive);
      }
    }
    
    if (userToLogin && userToLogin.isActive) {
      setUser(userToLogin);
    } else if (userToLogin && !userToLogin.isActive) {
       console.warn(`Usuário ${userToLogin.name} (${role}) está inativo. Login não realizado.`);
       setUser(null);
    } else {
      console.warn(`Nenhum usuário ativo encontrado para o papel: ${role}`);
      setUser(null);
    }
  }, [usersData, setUser]);
  
  const updateMockVida = useCallback((updatedVida: Vida) => {
    setVidasData(prev => prev.map(v => v.id === updatedVida.id ? updatedVida : v));
    // Lógica de atualização de User e CellGroup associada a Vida (pode precisar de ajustes pós-Supabase)
  }, []);

  const addMockVida = useCallback((newVida: Vida) => {
    setVidasData(prev => [{...newVida, createdAt: newVida.createdAt || new Date()}, ...prev]);
  }, []);

  const updateMockCellGroup = useCallback((updatedCG: CellGroup, oldLiderVidaId?: string) => {
    setCellGroupsData(prevCGs => prevCGs.map(cg => cg.id === updatedCG.id ? updatedCG : cg));
    // Lógica de atualização de User e Vida associada a CellGroup (pode precisar de ajustes)
  }, []);

  const addMockCellGroup = useCallback((newCG: CellGroup) => {
    const cellWithDefaults = {...newCG, lastStatusUpdate: newCG.lastStatusUpdate || new Date()};
    setCellGroupsData(prev => [cellWithDefaults, ...prev]);
    if (newCG.liderVidaId) {
        updateMockCellGroup(cellWithDefaults); // Esta chamada pode precisar ser revista
    }
  }, [updateMockCellGroup]);

  const addMockUser = useCallback((newUser: User) => {
    setUsersData(prev => {
      const existingUserIndex = prev.findIndex(u => u.vidaId && newUser.vidaId && u.vidaId === newUser.vidaId);
      if (existingUserIndex !== -1) {
        const updatedUsers = [...prev];
        updatedUsers[existingUserIndex] = {...updatedUsers[existingUserIndex], ...newUser, isActive: newUser.isActive ?? updatedUsers[existingUserIndex].isActive ?? true};
        if (user && user.id === updatedUsers[existingUserIndex].id) {
          setUserState(updatedUsers[existingUserIndex]); // Atualiza user se for o mesmo
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
          setUserState(mergedUser); // Atualiza user se for o mesmo
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

  const toggleUserActiveStatus = useCallback((userIdToToggle: string) => {
    // Esta função precisará ser adaptada para atualizar o status no Supabase
    setUsersData(prevUsers =>
      prevUsers.map(u => {
        if (u.id === userIdToToggle) {
          const newActiveStatus = u.isActive === undefined ? false : !u.isActive;
          const updatedUserRecord = { ...u, isActive: newActiveStatus };
          if (user && user.id === userIdToToggle) {
            setUserState(updatedUserRecord); // Atualiza user se for o mesmo
          }
          return updatedUserRecord;
        }
        return u;
      })
    );
  }, [user]);

  const toggleLiderPodeVerRelatorios = useCallback(() => {
    setAppPermissions(prev => {
        const newPermissions = { ...prev, liderPodeVerRelatorios: !prev.liderPodeVerRelatorios };
        if (typeof window !== 'undefined') {
            localStorage.setItem('appPermissions', JSON.stringify(newPermissions));
        }
        return newPermissions;
    });
  }, []);
  
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
    loginWithEmail,
    logout,
    simulateLoginByRole,
    mockUsers: usersData,
    mockVidas: vidasData,
    mockCellGroups: cellGroupsData,
    mockOfferings: offeringsData,
    mockPeaceHouses: peaceHousesData,
    updateMockVida,
    addMockVida,
    updateMockCellGroup,
    addMockCellGroup,
    addMockUser,
    updateMockUser,
    addMockOffering,
    addMockPeaceHouse,
    updateMockPeaceHouse,
    toggleUserActiveStatus,
    appPermissions,
    toggleLiderPodeVerRelatorios,
    geracaoVideiraConfig,
    setGeracaoVideiraDescription,
  }), [
    user, setUser, loginWithEmail, logout, simulateLoginByRole, 
    usersData, vidasData, cellGroupsData, offeringsData, peaceHousesData, 
    updateMockVida, addMockVida, updateMockCellGroup, addMockCellGroup, 
    addMockUser, updateMockUser, addMockOffering, addMockPeaceHouse, updateMockPeaceHouse,
    toggleUserActiveStatus, appPermissions, toggleLiderPodeVerRelatorios,
    geracaoVideiraConfig, setGeracaoVideiraDescription
  ]);

  if (loadingAuth && typeof window !== 'undefined' && !localStorage.getItem('authUser')) {
    // Pode mostrar um loader global aqui se desejar, enquanto o Supabase verifica a sessão
    // return <YourGlobalLoader />; 
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
