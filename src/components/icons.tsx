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
};

export type IconKey = keyof typeof Icons;
