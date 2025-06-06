
import {
  Grape,
  LayoutDashboard,
  Users, // Usado para "Vidas"
  HandCoins,
  Home, // Alterado de ShieldCheck para Home
  ClipboardCheck,
  BarChartBig,
  LayoutGrid, // Usado para "Grupos de Células"
  Settings,
  LogOut,
  UsersRound, // Usado para Encounter Teams
  UserCog, // Usado para "Líderes"
  type LucideIcon,
} from 'lucide-react';

export const Icons = {
  Logo: Grape,
  Dashboard: LayoutDashboard,
  Vidas: Users, // Renomeado de Members para Vidas
  CellGroups: LayoutGrid,
  Lideres: UserCog, // Novo ícone para Líderes
  Offerings: HandCoins,
  PeaceHouses: Home, // Alterado de ShieldCheck para Home
  Lessons: ClipboardCheck,
  Reports: BarChartBig,
  Settings: Settings,
  Logout: LogOut,
  EncounterTeams: UsersRound,
};

export type IconKey = keyof typeof Icons;
