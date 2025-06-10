
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert, UserCircle, Lock, ListChecks, UserCog, SlidersHorizontal } from "lucide-react"; // Adicionado SlidersHorizontal

// Mock para descrever as permissões dos papéis
const rolePermissionsData = {
  missionario: {
    label: "Missionário (Administrador)",
    description: "Acesso total ao sistema, incluindo gerenciamento de usuários, configurações globais e todos os dados da igreja.",
    permissions: [
      { feature: "Dashboard Completo", description: "Visualizar todas as métricas e dados consolidados." },
      { feature: "Gerenciamento de Grupos de Células", description: "Criar, editar e visualizar todos os grupos de células." },
      { feature: "Gerenciamento de Vidas", description: "Adicionar, editar e visualizar todas as vidas cadastradas." },
      { feature: "Gerenciamento de Líderes", description: "Promover vidas a líderes, definir células e gerenciar acesso (ativar/inativar)." },
      { feature: "Gerenciamento de Equipes de Encontro", description: "Criar equipes para eventos, adicionar membros e definir funções." },
      { feature: "Rastreamento de Ofertas", description: "Registrar e visualizar todas as ofertas, filtrar por célula, mês e ano." },
      { feature: "Coordenação de Casas de Paz", description: "Agendar e visualizar todas as casas de paz." },
      { feature: "Acompanhamento de Lições", description: "Visualizar e gerenciar o progresso das lições em todas as casas de paz." },
      { feature: "Relatórios Gerais", description: "Acessar todos os relatórios consolidados da igreja (status de células, crescimento, financeiro)." },
      { feature: "Configurações do Sistema", description: "Acesso às configurações de perfil e gerenciamento de permissões (visualização)." },
      { feature: "Gerenciamento de Usuários (Futuro)", description: "Capacidade de gerenciar contas de usuário diretamente." },
    ],
  },
  lider_de_celula: {
    label: "Líder de Célula",
    description: "Acesso focado no gerenciamento da sua própria célula e vidas associadas.",
    permissions: [
      { feature: "Dashboard Pessoal", description: "Visualizar métricas relevantes para sua liderança." },
      { feature: "Gerenciamento da Minha Célula", description: "Editar dados (nome, endereço, dia/hora) e registrar o status semanal da sua célula." },
      { feature: "Gerenciamento de Vidas da Célula", description: "Adicionar e editar informações das vidas vinculadas à sua célula." },
      { feature: "Registro de Ofertas da Célula", description: "Registrar ofertas específicas da sua célula." },
      { feature: "Acompanhamento de Lições (Casas de Paz da Célula)", description: "Registrar o progresso das lições nas casas de paz sob sua responsabilidade." },
      { feature: "Configurações de Perfil", description: "Visualizar informações do seu perfil." },
    ],
  },
};

type RoleKey = keyof typeof rolePermissionsData;

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
      <div className="flex items-center gap-3">
        <UserCog className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-3xl font-semibold">Configurações</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="profile">
            <UserCircle className="mr-2 h-4 w-4" /> Meu Perfil
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Lock className="mr-2 h-4 w-4" /> Gerenciar Permissões
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Perfil do Usuário</CardTitle>
              <CardDescription className="font-body">
                Estas são as informações da sua conta atualmente logada.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={user.name} readOnly className="font-body" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} readOnly className="font-body" />
              </div>
              <div>
                <Label htmlFor="role">Papel de Acesso</Label>
                <Input id="role" value={user.role === 'missionario' ? 'Missionário (Administrador)' : 'Líder de Célula'} readOnly className="font-body" />
              </div>
              {user.role === 'lider_de_celula' && user.cellGroupName && (
                <div>
                  <Label htmlFor="cellGroup">Célula Liderada</Label>
                  <Input id="cellGroup" value={user.cellGroupName} readOnly className="font-body" />
                </div>
              )}
               <div className="pt-4">
                 <Button variant="outline" disabled>Editar Perfil (Em breve)</Button>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Visão Geral das Permissões por Papel</CardTitle>
              <CardDescription className="font-body">
                Entenda as capacidades e o nível de acesso de cada papel no sistema. Atualmente, as permissões são fixas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(rolePermissionsData).map(([roleKey, roleInfo]) => (
                  <AccordionItem value={roleKey} key={roleKey}>
                    <AccordionTrigger className="font-headline text-lg hover:no-underline">
                      <div className="flex items-center gap-2">
                        {roleKey === 'missionario' ? <UserCog className="h-5 w-5 text-primary" /> : <UserCircle className="h-5 w-5 text-primary" />}
                        {roleInfo.label}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pl-2">
                      <p className="text-sm text-muted-foreground font-body italic mb-3">{roleInfo.description}</p>
                      <ul className="space-y-2 font-body">
                        {roleInfo.permissions.map((perm, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <ListChecks className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                            <div>
                              <span className="font-medium">{perm.feature}:</span>
                              <span className="text-muted-foreground ml-1">{perm.description}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {user.role === 'missionario' && (
                <Card className="mt-8 shadow-md">
                  <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-primary" />
                      Gerenciamento Avançado de Permissões
                    </CardTitle>
                    <CardDescription className="font-body">
                        Ajuste fino de permissões e criação de papéis customizados.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-body mb-4">
                        Esta seção permitirá, no futuro, que administradores (Missionários) tenham controle granular sobre as permissões de usuários individuais ou criem novos papéis com conjuntos de acesso específicos.
                        Isso oferece flexibilidade máxima para adaptar o sistema às necessidades da igreja.
                    </p>
                    <div className="p-6 border border-dashed rounded-lg bg-background/50 text-center">
                        <p className="text-muted-foreground font-body mb-3">
                            Funcionalidade de edição avançada de permissões está em desenvolvimento.
                        </p>
                        <Button variant="outline" disabled>
                            Configurar Permissões Detalhadas (Em breve)
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Placeholder for other settings sections if needed */}
      {user.role === 'missionario' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-headline">Gerenciamento de Usuários (Placeholder)</CardTitle>
            <CardDescription className="font-body">
              Adicionar, editar ou remover usuários e suas permissões.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
              Interface de gerenciamento de usuários (Acesso de Missionário).
            </div>
            <Button className="mt-4" disabled>Adicionar Usuário (Em breve)</Button>
          </CardContent>
        </Card>
      )}

       <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-headline">Preferências do Sistema (Placeholder)</CardTitle>
          <CardDescription className="font-body">
            Configurações de tema, notificações, etc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            Opções de preferências gerais do sistema.
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
