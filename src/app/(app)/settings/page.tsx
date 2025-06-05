
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Acesso Negado</h2>
        <p className="text-muted-foreground">Você precisa estar logado para acessar as configurações.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-semibold">Configurações</h1>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Perfil do Usuário</CardTitle>
          <CardDescription className="font-body">
            Informações da sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={user.name} readOnly />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} readOnly />
          </div>
          <div>
            <Label htmlFor="role">Papel</Label>
            <Input id="role" value={user.role === 'missionario' ? 'Missionário (Administrador)' : 'Líder de Célula'} readOnly />
          </div>
          {user.role === 'lider_de_celula' && user.cellGroupName && (
            <div>
              <Label htmlFor="cellGroup">Célula</Label>
              <Input id="cellGroup" value={user.cellGroupName} readOnly />
            </div>
          )}
        </CardContent>
      </Card>

      {user.role === 'missionario' && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Gerenciamento de Usuários</CardTitle>
            <CardDescription className="font-body">
              Adicionar, editar ou remover usuários e suas permissões. (Placeholder)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
              Interface de gerenciamento de usuários (Missionário).
            </div>
            <Button className="mt-4">Adicionar Usuário (Placeholder)</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Preferências</CardTitle>
          <CardDescription className="font-body">
            Configurações de tema, notificações, etc. (Placeholder)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            Opções de preferências do sistema.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
