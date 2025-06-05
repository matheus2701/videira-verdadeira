import { Icons, type IconKey } from '@/components/icons';

export interface NavItem {
  label: string;
  href: string;
  iconKey: IconKey;
  disabled?: boolean;
}

export const mainNav: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    iconKey: 'Dashboard',
  },
  {
    label: 'Grupos de Células',
    href: '/cell-groups',
    iconKey: 'CellGroups',
  },
  {
    label: 'Membros',
    href: '/members',
    iconKey: 'Members',
  },
  {
    label: 'Ofertas',
    href: '/offerings',
    iconKey: 'Offerings',
  },
  {
    label: 'Casas de Paz',
    href: '/peace-houses',
    iconKey: 'PeaceHouses',
  },
  {
    label: 'Progresso das Lições',
    href: '/lessons',
    iconKey: 'Lessons',
  },
  {
    label: 'Relatórios',
    href: '/reports',
    iconKey: 'Reports',
  },
];

export const userNav: NavItem[] = [
 {
    label: 'Configurações',
    href: '/settings',
    iconKey: 'Settings',
  },
  {
    label: 'Sair',
    href: '/logout', // Placeholder, actual logout logic would be needed
    iconKey: 'Logout',
  },
];
