
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert, UserCog, PlusCircle } from "lucide-react";
import Link from "next/link"; // Adicionado para o botão

export default function LideresPage() {
  const { user } = useAuth();

  // Placeholder: Esta página é principalmente para missionários gerenciarem líderes.
  // Líderes de célula não teriam acesso direto a esta visão geral de todos os líderes.
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold">Gerenciar Líderes</h1>
        <Button asChild>
          <Link href="/lideres/novo"> {/* Placeholder para link de adicionar novo líder */}
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Líder
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Cadastro de Líderes</CardTitle>
          <CardDescription className="font-body">
            Gerencie os líderes da igreja, suas células associadas e permissões.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-8 p-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground space-y-4">
            <UserCog className="w-16 h-16 text-primary/70" />
            <p className="text-lg font-medium font-headline">Gerenciamento de Líderes em Desenvolvimento</p>
            <p className="font-body text-sm max-w-md">
              Esta seção permitirá cadastrar novos líderes (promovendo a partir de "Vidas" ou diretamente),
              associá-los a células, definir suas gerações e gerenciar seus papéis no sistema.
            </p>
            <p className="font-body text-xs">
              Funcionalidades como listagem, edição e filtros para líderes estarão disponíveis em breve.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
