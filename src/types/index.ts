
export type Role = 'missionario' | 'lider_de_celula';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  cellGroupId?: string; // ID da célula que o líder lidera
  cellGroupName?: string; // Nome da célula para exibição
}

// Interface para um item de navegação, atualizada para incluir papéis
export interface NavItemConfig {
  label: string;
  href: string;
  iconKey: string; // Manter como string para ser chave de Icons
  disabled?: boolean;
  roles?: Role[]; // Papéis que podem ver este item. Se undefined, todos podem ver.
  exact?: boolean; // Se o path deve ser exato para isActive
}

// Types for Encounter Teams feature
export const encounterTeamRoles = ['Líder da Equipe', 'Apoio Geral', 'Apoio Santuário', 'Cozinha', 'Intercessor'] as const;
export type EncounterTeamRole = typeof encounterTeamRoles[number];

export interface EncounterTeam {
  id: string;
  name: string;
  eventDate?: Date;
  description?: string;
  createdAt: Date;
}

export interface EncounterTeamMember {
  id: string;
  encounterTeamId: string;
  name: string;
  contact?: string;
  teamRole: EncounterTeamRole;
  notes?: string;
  addedAt: Date;
}
