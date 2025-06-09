
import { z } from "zod";

export type Role = 'missionario' | 'lider_de_celula';

// Representa um usuário autenticado do sistema, seu papel e potencial vínculo com um perfil de Vida.
export interface User {
  id: string; // ID do sistema de autenticação
  name: string; // Nome para exibição no perfil (pode ser da Vida associada)
  email: string;
  role: Role;
  vidaId?: string; // ID da Vida associada, se o usuário for um líder de célula
  cellGroupId?: string; // ID da célula que o líder (User) lidera
  cellGroupName?: string; // Nome da célula para exibição rápida
}

export type VidaStatus = 'membro' | 'lider_em_treinamento' | 'lider_ativo';

// Representa um indivíduo na igreja, seus detalhes pessoais e afiliação à célula.
export interface Vida {
  id: string; // ID único da Vida
  nomeCompleto: string;
  dataNascimento: Date;
  telefone?: string;
  idCelula: string; // ID da célula à qual a Vida está vinculada
  nomeCelula?: string; // Nome da célula para exibição (pode ser buscado)
  geracaoCelula?: string; // Geração da célula (pode ser buscado ou informado)
  status: VidaStatus;
  createdAt: Date;
  // historicoLiderancaIds?: string[]; // Futuro: para rastrear se já foi líder
}

export type CellMeetingStatus = 'agendada' | 'aconteceu' | 'nao_aconteceu_com_aviso' | 'nao_aconteceu_sem_aviso' | 'cancelada_com_aviso';

export const cellMeetingStatusOptions: { value: CellMeetingStatus; label: string }[] = [
  { value: 'agendada', label: 'Agendada' },
  { value: 'aconteceu', label: 'Aconteceu' },
  { value: 'nao_aconteceu_com_aviso', label: 'Não Aconteceu (Com Aviso)' },
  { value: 'nao_aconteceu_sem_aviso', label: 'Não Aconteceu (Sem Aviso)' },
  { value: 'cancelada_com_aviso', label: 'Cancelada (Com Aviso)' },
];

// Representa um grupo de célula com seus detalhes de reunião e informações do líder.
export interface CellGroup {
  id: string;
  name: string;
  address: string;
  meetingDay: string;
  meetingTime: string;
  geracao?: string;
  liderVidaId?: string; // ID da Vida que é líder desta célula
  liderNome?: string; // Nome da Vida líder para exibição
  meetingStatus?: CellMeetingStatus;
  meetingStatusReason?: string;
  lastStatusUpdate?: Date;
  // totalMembros?: number; // Futuro: pode ser calculado
}

// Configuração para itens de navegação.
export interface NavItemConfig {
  label: string;
  href: string;
  iconKey: string;
  disabled?: boolean;
  roles?: Role[];
  exact?: boolean;
}

export const encounterTeamRoles = ['Líder da Equipe', 'Apoio Geral', 'Apoio Santuário', 'Cozinha', 'Intercessor'] as const;
export type EncounterTeamRole = typeof encounterTeamRoles[number];

// Representa uma equipe para um evento de Encontro da Paz, incluindo detalhes do evento e organizador.
export interface EncounterTeam {
  id: string;
  name: string;
  eventDate?: Date;
  description?: string;
  createdAt: Date;
  organizerUserId?: string; 
  organizerUserName?: string;
}

// Representa um membro de uma equipe de Encontro da Paz.
export interface EncounterTeamMember {
  id: string;
  encounterTeamId: string; // Links to EncounterTeam
  name: string;
  contact?: string;
  teamRole: EncounterTeamRole;
  notes?: string;
  addedAt: Date;
}

// Schema Zod para validação do formulário de registro de ofertas.
export const offeringSchema = z.object({
  amount: z.coerce.number().positive({ message: "Valor deve ser positivo." }),
  date: z.date({ required_error: "Data da oferta é obrigatória." }),
  cellGroupName: z.string().optional(),
  notes: z.string().optional(),
});

// Tipo inferido do schema Zod para os valores do formulário de oferta.
export type OfferingFormValues = z.infer<typeof offeringSchema>;

// Representa uma oferta registrada e armazenada no sistema.
export interface StoredOffering extends OfferingFormValues {
  id: string;
}
