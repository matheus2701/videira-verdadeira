
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert, UserCog, PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import type { Vida } from "@/types";

export default function LideresPage() {
  const { user, mockVidas } = useAuth();

  if (user?.role !== 'missionario') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="font-headline text-3xl font-semibold mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground">
          Você não tem permissão para acessar esta página de gerenciamento de líderes.
        </p>
      </div>
    );
  }

  const lideresList: Vida[] = mockVidas.filter(
    (v) => v.status === 'lider_ativo' || v.status === 'lider_em_treinamento'
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            <UserCog className="h-8 w-8 text-primary"/>
            <h1 className="font-headline text-3xl font-semibold">Gerenciar Líderes</h1>
        </div>
        <Button asChild>
          <Link href="/lideres/novo">
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar/Promover Líder
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Listagem de Líderes</CardTitle>
          <CardDescription className="font-body">
            Visualize os líderes ativos e em treinamento e as células que lideram.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lideresList.length === 0 ? (
            <div className="mt-8 p-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground space-y-4">
              <Users className="w-16 h-16 text-primary/70" />
              <p className="text-lg font-medium font-headline">Nenhum Líder Cadastrado</p>
              <p className="font-body text-sm max-w-md">
                Promova uma vida para liderança ou adicione um novo líder para começar.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Líder</TableHead>
                  <TableHead>Célula Liderada</TableHead>
                  <TableHead>Geração da Célula</TableHead>
                  <TableHead>Status do Líder</TableHead>
                  <TableHead>Contato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lideresList.map((lider) => (
                  <TableRow key={lider.id}>
                    <TableCell className="font-medium">{lider.nomeCompleto}</TableCell>
                    <TableCell>{lider.nomeCelula || <span className="text-muted-foreground italic">Não especificada</span>}</TableCell>
                    <TableCell>{lider.geracaoCelula || <span className="text-muted-foreground italic">N/A</span>}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        lider.status === 'lider_ativo' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' :
                        lider.status === 'lider_em_treinamento' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' :
                        ''
                      }`}>
                        {lider.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </TableCell>
                    <TableCell>{lider.telefone || <span className="text-muted-foreground italic">N/A</span>}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                Exibindo {lideresList.length} líder(es).
              </TableCaption>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
