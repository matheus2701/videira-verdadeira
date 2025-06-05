import {
  Grape,
  LayoutDashboard,
  Users,
  HandCoins,
  ShieldCheck,
  ClipboardCheck,
  BarChartBig,
  LayoutGrid,
  Settings,
  LogOut,
  UsersRound, // Added for Encounter Teams
  type LucideIcon,
} from 'lucide-react';

export const Icons = {
  Logo: Grape,
  Dashboard: LayoutDashboard,
  CellGroups: LayoutGrid,
  Members: Users,
  Offerings: HandCoins,
  PeaceHouses: ShieldCheck,
  Lessons: ClipboardCheck,
  Reports: BarChartBig,
  Settings: Settings,
  Logout: LogOut,
  EncounterTeams: UsersRound, // Added for Encounter Teams
};

export type IconKey = keyof typeof Icons;
