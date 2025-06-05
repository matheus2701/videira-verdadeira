
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, PlusCircle, User, UsersRound, ShieldCheck, Utensils, HelpingHand, UserCog, CalendarDays } from "lucide-react";
import type { EncounterTeam, EncounterTeamMember, EncounterTeamRole } from "@/types";
import { encounterTeamRoles } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data - replace with Firebase fetching
const mockEncounterTeams: EncounterTeam[] = [
  { id: "team1", name: "Encontro de Paz - Julho 2024", eventDate: new Date("2024-07-20T10:00:00Z"), createdAt: new Date(), description: "Primeiro encontro do segundo semestre." },
  { id: "team2", name: "Encontro de Paz - Setembro 2024", eventDate: new Date("2024-09-15T10:00:00Z"), createdAt: new Date(), description: "Foco em novas famílias." },
];

const mockTeamMembers: EncounterTeamMember[] = [
  { id: "m1", encounterTeamId: "team1", name: "Alice Silva", teamRole: "Cozinha", addedAt: new Date(), contact: "(11) 98765-4321" },
  { id: "m2", encounterTeamId: "team1", name: "Bruno Costa", teamRole: "Apoio Santuário", addedAt: new Date() },
  { id: "m3", encounterTeamId: "team1", name: "Carla Dias", teamRole: "Intercessor", addedAt: new Date(), notes: "Ficará no santuário principal." },
  { id: "m4", encounterTeamId: "team2", name: "Daniel Souza", teamRole: "Apoio Geral", addedAt: new Date() },
  { id: "m5", encounterTeamId: "team1", name: "Eduarda Lima", teamRole: "Cozinha", addedAt: new Date() },
  { id: "m6", encounterTeamId: "team1", name: "Fernando Alves", teamRole: "Líder da Equipe", addedAt: new Date(), notes: "Líder geral da equipe." },
];

const roleIconsRecord: Record<EncounterTeamRole, React.ElementType> = {
  'Líder da Equipe': UserCog,
  'Apoio Geral': HelpingHand,
  'Apoio Santuário': ShieldCheck,
  'Cozinha': Utensils,
  'Intercessor': UsersRound,
};

export default function EncounterTeamDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;

  const [team, setTeam] = useState<EncounterTeam | null>(null);
  const [members, setMembers] = useState<EncounterTeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teamId) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const foundTeam = mockEncounterTeams.find(t => t.id === teamId);
        const teamMembers = mockTeamMembers.filter(m => m.encounterTeamId === teamId);
        setTeam(foundTeam || null);
        setMembers(teamMembers);
        setLoading(false);
      }, 500);
    }
  }, [teamId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Equipe não encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body">A equipe que você está procurando não existe ou foi removida.</p>
            <Button onClick={() => router.push('/encounter-teams')} className="mt-4">
              Voltar para lista de equipes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const membersByRole: Record<EncounterTeamRole, EncounterTeamMember[]> =
    encounterTeamRoles.reduce((acc, role) => {
      acc[role] = members.filter(member => member.teamRole === role);
      return acc;
    }, {} as Record<EncounterTeamRole, EncounterTeamMember[]>);


  return (
    <div className="space-y-8">
      <div>
        <Button variant="outline" size="sm" onClick={() => router.push('/encounter-teams')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Equipes
        </Button>
        <h1 className="text-3xl font-headline">{team.name}</h1>
        {team.eventDate && (
          <p className="text-muted-foreground font-body flex items-center gap-2 mt-1">
            <CalendarDays className="w-4 h-4"/>
            Data do Evento: {new Date(team.eventDate).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
        {team.description && <p className="text-sm text-muted-foreground mt-1 font-body">{team.description}</p>}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline">Membros da Equipe ({members.length})</h2>
        <Button asChild>
          <Link href={`/encounter-teams/${teamId}/members/new`}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Adicionar Membro
          </Link>
        </Button>
      </div>

      {members.length === 0 && (
        <Card>
          <CardHeader><CardTitle className="font-headline">Nenhum membro nesta equipe</CardTitle></CardHeader>
          <CardContent><p className="font-body">Adicione o primeiro membro a esta equipe.</p></CardContent>
        </Card>
      )}

      {encounterTeamRoles.map(role => {
        const roleMembers = membersByRole[role];
        if (!roleMembers || roleMembers.length === 0) return null;

        const IconComponent = roleIconsRecord[role] || User;

        return (
          <section key={role} className="space-y-4">
            <h3 className="text-xl font-headline flex items-center gap-2 border-b pb-2">
              <IconComponent className="w-6 h-6 text-primary" />
              {role} ({roleMembers.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roleMembers.map(member => (
                <Card key={member.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-headline">{member.name}</CardTitle>
                    {member.contact && <CardDescription className="text-xs font-body">{member.contact}</CardDescription>}
                  </CardHeader>
                  {member.notes && (
                    <CardContent className="pt-0 pb-3">
                      <p className="text-xs text-muted-foreground font-body">Obs: {member.notes}</p>
                    </CardContent>
                  )}
                   {member.addedAt && (
                    <CardFooter className="text-xs text-muted-foreground pt-0 font-body">
                        Adicionado em: {new Date(member.addedAt).toLocaleDateString('pt-BR')}
                    </CardFooter>
                   )}
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
