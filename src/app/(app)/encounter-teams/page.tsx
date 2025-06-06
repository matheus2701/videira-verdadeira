
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, UsersRound, CalendarDays, UserCircle } from 'lucide-react';
import type { EncounterTeam } from '@/types';
import { useRouter } from 'next/navigation';

// Mock data - replace with actual data fetching
// Note: Update these mocks to use organizerUserId and organizerUserName
const mockEncounterTeams: EncounterTeam[] = [
  {
    id: "team1",
    name: "Encontro de Paz - Julho 2024",
    eventDate: new Date("2024-07-20"),
    createdAt: new Date(),
    description: "Primeiro encontro do segundo semestre.",
    organizerUserId: "user-missionario-01", // Example: Missionário como organizador
    organizerUserName: "Admin Missionário"
  },
  {
    id: "team2",
    name: "Encontro de Paz - Setembro 2024",
    eventDate: new Date("2024-09-15"),
    createdAt: new Date(),
    description: "Foco em novas famílias.",
    organizerUserId: "user-lider-joao-01", // Example: Líder João como organizador
    organizerUserName: "Líder João"
  },
  {
    id: "team3",
    name: "Encontro de Colheita - Novembro 2024",
    eventDate: new Date("2024-11-10"),
    createdAt: new Date(),
    // No organizer defined for this example
  },
];

export default function EncounterTeamsPage() {
  const router = useRouter();

  const encounterTeams = mockEncounterTeams;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline">Equipes do Encontro da Paz</h1>
          <p className="text-muted-foreground font-body">Gerencie as equipes para os Encontros de Paz e outros eventos.</p>
        </div>
        <Button asChild>
          <Link href="/encounter-teams/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Nova Equipe do Encontro da Paz
          </Link>
        </Button>
      </div>

      {encounterTeams.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Nenhuma Equipe Cadastrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body">Ainda não há equipes de encontro cadastradas. Clique em "Nova Equipe do Encontro da Paz" para adicionar a primeira.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {encounterTeams.map((team) => (
            <Card
              key={team.id}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between"
              onClick={() => router.push(`/encounter-teams/${team.id}`)}
            >
              <CardHeader>
                <div className="flex items-start gap-3 mb-2">
                  <UsersRound className="w-7 h-7 text-primary mt-1 shrink-0" />
                  <CardTitle className="font-headline text-xl">{team.name}</CardTitle>
                </div>
                {team.eventDate && (
                  <CardDescription className="flex items-center gap-1.5 font-body text-xs">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {new Date(team.eventDate).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </CardDescription>
                )}
                {team.organizerUserName && (
                   <CardDescription className="flex items-center gap-1.5 font-body text-xs mt-1">
                        <UserCircle className="w-3.5 h-3.5" />
                        Organizador: {team.organizerUserName}
                    </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 font-body">
                  {team.description || "Sem descrição."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
