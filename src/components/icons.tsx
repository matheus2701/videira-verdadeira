
import {
  Grape,
  LayoutDashboard,
  Users, // Usado para "Vidas"
  HandCoins,
  Home, // Usado para "PeaceHouses"
  ClipboardCheck,
  BarChartBig,
  LayoutGrid, // Usado para "Grupos de Células"
  Settings,
  LogOut,
  UsersRound, // Usado para Encounter Teams
  UserCog, // Usado para "Líderes"
  Network, // Novo ícone para Geração Videira
  type LucideIcon,
} from 'lucide-react';

export const Icons = {
  Logo: Grape,
  Dashboard: LayoutDashboard,
  Vidas: Users, // Renomeado de Members para Vidas
  CellGroups: LayoutGrid,
  Lideres: UserCog,
  GeracaoVideira: Network, // Adicionado
  EncounterTeams: UsersRound,
  Offerings: HandCoins,
  PeaceHouses: Home,
  Lessons: ClipboardCheck,
  Reports: BarChartBig,
  Settings: Settings,
  Logout: LogOut,
};

export type IconKey = keyof typeof Icons;
