
'use client';

import { useMemo } from "react"; // Adicionado useMemo
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert, UserCog, PlusCircle, Users, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import type { Vida, User as AuthUser } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface LiderComUserStatus extends Vida {
  userId?: string;
  userIsActive?: boolean;
  userEmail?: string;
}

export default function LideresPage() {
  const { user, mockVidas, mockUsers, toggleUserActiveStatus } = useAuth();
  const { toast } = useToast();

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

  const lideresListComUserStatus: LiderComUserStatus[] = useMemo(() => {
    return mockVidas
      .filter((v) => v.status === 'lider_ativo' || v.status === 'lider_em_treinamento')
      .map(lider => {
        const userAccount = mockUsers.find(u => u.vidaId === lider.id);
        return {
          ...lider,
          userId: userAccount?.id,
          userIsActive: userAccount?.isActive,
          userEmail: userAccount?.email,
        };
      });
  }, [mockVidas, mockUsers]);

  const handleToggleUserStatus = (leaderName: string, userId?: string) => {
    if (!userId) {
      toast({
        title: "Erro",
        description: `Usuário não encontrado para ${leaderName}.`,
        variant: "destructive",
      });
      return;
    }
    toggleUserActiveStatus(userId);
    const updatedUser = mockUsers.find(u => u.id === userId); // Busca atualizada após toggle
    toast({
      title: "Status de Acesso Alterado",
      description: `O acesso para ${leaderName} (${updatedUser?.email}) foi ${updatedUser?.isActive ? 'ativado' : 'inativado'}.`,
    });
  };

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
            Visualize os líderes ativos e em treinamento, as células que lideram e gerencie o status de acesso de suas contas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lideresListComUserStatus.length === 0 ? (
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
                  <TableHead>Nome do Líder / Email</TableHead>
                  <TableHead>Célula Liderada</TableHead>
                  <TableHead>Status Líder (Vida)</TableHead>
                  <TableHead>Status Acesso (Login)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lideresListComUserStatus.map((lider) => (
                  <TableRow key={lider.id}>
                    <TableCell className="font-medium">
                      <div>{lider.nomeCompleto}</div>
                      {lider.userEmail && <div className="text-xs text-muted-foreground">{lider.userEmail}</div>}
                    </TableCell>
                    <TableCell>{lider.nomeCelula || <span className="text-muted-foreground italic">Não especificada</span>}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        lider.status === 'lider_ativo' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' :
                        lider.status === 'lider_em_treinamento' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' :
                        ''
                      }`}>
                        {lider.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </TableCell>
                    <TableCell>
                      {lider.userId ? (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          lider.userIsActive ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                        }`}>
                          {lider.userIsActive ? 'Ativo' : 'Inativo'}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">Sem Login</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleToggleUserStatus(lider.nomeCompleto, lider.userId)}
                        disabled={!lider.userId}
                        title={!lider.userId ? "Este líder não possui uma conta de usuário para alterar o status." : (lider.userIsActive ? "Desativar Acesso" : "Ativar Acesso")}
                      >
                        {lider.userIsActive ? <ToggleRight className="mr-1 h-4 w-4 text-green-600" /> : <ToggleLeft className="mr-1 h-4 w-4 text-red-600" />}
                        {lider.userIsActive ? "Desativar" : "Ativar"}
                      </Button>
                       {/* Adicionar outros botões de ação aqui se necessário, ex: Ver Detalhes, Editar Vida Líder */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                Exibindo {lideresListComUserStatus.length} líder(es).
              </TableCaption>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
