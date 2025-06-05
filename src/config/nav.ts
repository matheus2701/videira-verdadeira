
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
    roles: ['missionario'], // Apenas missionário gerencia TODAS as células
  },
  {
    label: 'Minha Célula', // Novo item para Líder de Célula
    href: '/cell-groups/my-cell', // Poderia ser /cell-groups?id=my ou uma rota específica
    iconKey: 'CellGroups',
    roles: ['lider_de_celula'],
  },
  {
    label: 'Membros',
    href: '/members',
    iconKey: 'Members',
    roles: ['missionario', 'lider_de_celula'],
  },
  {
    label: 'Equipes de Encontro', // New Menu Item
    href: '/encounter-teams',
    iconKey: 'EncounterTeams',
    roles: ['missionario'], // Assuming only missionario manages this for now
  },
  {
    label: 'Ofertas',
    href: '/offerings',
    iconKey: 'Offerings',
    roles: ['missionario', 'lider_de_celula'], // Líder vê/registra ofertas da sua célula
  },
  {
    label: 'Casas de Paz',
    href: '/peace-houses',
    iconKey: 'PeaceHouses',
    roles: ['missionario', 'lider_de_celula'], // Líder vê/registra CPs da sua célula
  },
  {
    label: 'Progresso das Lições',
    href: '/lessons',
    iconKey: 'Lessons',
    roles: ['missionario', 'lider_de_celula'], // Líder vê progresso da sua célula/CPs
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
    href: '#', // Placeholder, o logout será tratado pelo AuthContext
    iconKey: 'Logout',
    roles: ['missionario', 'lider_de_celula'],
  },
];
