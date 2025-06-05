
import type { IconKey } from '@/components/icons';
import type { Role, NavItemConfig } from '@/types';


export const mainNav: NavItemConfig[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    iconKey: 'Dashboard',
    roles: ['missionario', 'lider_de_celula'],
    exact: true,
  },
  {
    label: 'Grupos de Células',
    href: '/cell-groups',
    iconKey: 'CellGroups',
    roles: ['missionario'],
  },
  {
    label: 'Minha Célula',
    href: '/cell-groups/my-cell',
    iconKey: 'CellGroups',
    roles: ['lider_de_celula'],
  },
  {
    label: 'Vidas', // Renomeado de Membros
    href: '/vidas', // Rota atualizada
    iconKey: 'Vidas', // Ícone atualizado
    roles: ['missionario', 'lider_de_celula'],
  },
  {
    label: 'Líderes', // Novo menu
    href: '/lideres',
    iconKey: 'Lideres',
    roles: ['missionario'], // Inicialmente para missionários
  },
  {
    label: 'Equipes de Encontro',
    href: '/encounter-teams',
    iconKey: 'EncounterTeams',
    roles: ['missionario'],
  },
  {
    label: 'Ofertas',
    href: '/offerings',
    iconKey: 'Offerings',
    roles: ['missionario', 'lider_de_celula'],
  },
  {
    label: 'Casas de Paz',
    href: '/peace-houses',
    iconKey: 'PeaceHouses',
    roles: ['missionario', 'lider_de_celula'],
  },
  {
    label: 'Progresso das Lições',
    href: '/lessons',
    iconKey: 'Lessons',
    roles: ['missionario', 'lider_de_celula'],
  },
  {
    label: 'Relatórios',
    href: '/reports',
    iconKey: 'Reports',
    roles: ['missionario'],
  },
];

export const userNav: NavItemConfig[] = [
 {
    label: 'Configurações',
    href: '/settings',
    iconKey: 'Settings',
    roles: ['missionario', 'lider_de_celula'],
  },
  {
    label: 'Sair',
    href: '#', 
    iconKey: 'Logout',
    roles: ['missionario', 'lider_de_celula'],
  },
];
