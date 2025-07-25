
'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert, UserCircle, Lock, ListChecks, UserCog, SlidersHorizontal, Settings as SettingsIcon, Package, Users, HandCoins, Home, BookOpen, BarChartBig, Edit, Save, UsersRound, Moon, Sun, Laptop } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel as RHFFormLabel, FormMessage } from "@/components/ui/form";
import { useTheme } from "@/contexts/ThemeContext"; // Importado
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Importado


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
      { feature: "Configurações do Sistema", description: "Acesso às configurações de perfil e gerenciamento de permissões." },
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
      { feature: "Configurações de Perfil", description: "Visualizar informações do seu perfil e editar alguns dados." },
    ],
  },
};

type RoleKey = keyof typeof rolePermissionsData;


interface PermissionAction {
  action: string;
  missionario: boolean;
  lider_de_celula: boolean | 'dynamic_reports'; 
}

interface PermissionModule {
  moduleName: string;
  icon: React.ElementType;
  permissions: PermissionAction[];
}

const editProfileSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Formato de e-mail inválido." }),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;


export default function SettingsPage() {
  const { user, appPermissions, toggleLiderPodeVerRelatorios, updateMockUser } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme(); // Hook de tema
  const { toast } = useToast();
  const [isDetailedPermissionsDialogOpen, setIsDetailedPermissionsDialogOpen] = useState(false);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []); // Para evitar hydration mismatch com tema

  const editProfileForm = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      editProfileForm.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, editProfileForm, isEditProfileDialogOpen]);


  if (!user || !mounted) { // Adicionado !mounted para aguardar hidratação
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Acesso Negado</h2>
        <p className="text-muted-foreground">Você precisa estar logado para acessar as configurações ou o tema está carregando.</p>
      </div>
    );
  }
  
  const detailedPermissionsConfig: PermissionModule[] = [
    {
      moduleName: "Gerenciamento Geral e Acessos",
      icon: SettingsIcon,
      permissions: [
        { action: "Acessar Dashboard Completo", missionario: true, lider_de_celula: true },
        { action: "Gerenciar Configurações do Sistema", missionario: true, lider_de_celula: false },
        { action: "Gerenciar Usuários e Papéis", missionario: true, lider_de_celula: false },
      ],
    },
    {
      moduleName: "Grupos de Células",
      icon: Package,
      permissions: [
        { action: "Visualizar Todas as Células", missionario: true, lider_de_celula: false },
        { action: "Criar Novas Células", missionario: true, lider_de_celula: false },
        { action: "Editar Dados de Qualquer Célula", missionario: true, lider_de_celula: false },
        { action: "Gerenciar Própria Célula (Dados e Status)", missionario: true, lider_de_celula: true },
        { action: "Excluir Células", missionario: true, lider_de_celula: false },
      ],
    },
    {
      moduleName: "Vidas e Membros",
      icon: Users,
      permissions: [
        { action: "Visualizar Todas as Vidas", missionario: true, lider_de_celula: false },
        { action: "Adicionar Novas Vidas (Qualquer Célula)", missionario: true, lider_de_celula: false },
        { action: "Adicionar Novas Vidas (Própria Célula)", missionario: true, lider_de_celula: true },
        { action: "Editar Dados de Qualquer Vida", missionario: true, lider_de_celula: false },
        { action: "Editar Dados de Vidas (Própria Célula)", missionario: true, lider_de_celula: true },
      ],
    },
    {
      moduleName: "Liderança",
      icon: UserCog,
      permissions: [
        { action: "Promover Vidas a Líderes", missionario: true, lider_de_celula: false },
        { action: "Designar Líderes para Células", missionario: true, lider_de_celula: false },
        { action: "Ativar/Inativar Contas de Líderes", missionario: true, lider_de_celula: false },
      ],
    },
    {
      moduleName: "Equipes de Encontro",
      icon: UsersRound,
      permissions: [
        { action: "Criar e Gerenciar Equipes de Encontro", missionario: true, lider_de_celula: false },
        { action: "Adicionar Membros a Equipes", missionario: true, lider_de_celula: false },
      ],
    },
    {
      moduleName: "Ofertas",
      icon: HandCoins,
      permissions: [
        { action: "Registrar Ofertas (Geral ou Célula)", missionario: true, lider_de_celula: false },
        { action: "Registrar Ofertas (Própria Célula)", missionario: true, lider_de_celula: true },
        { action: "Visualizar Todas as Ofertas", missionario: true, lider_de_celula: false },
      ],
    },
    {
      moduleName: "Casas de Paz",
      icon: Home,
      permissions: [
        { action: "Agendar e Gerenciar Todas as Casas de Paz", missionario: true, lider_de_celula: true },
        { action: "Visualizar Todas as Casas de Paz", missionario: true, lider_de_celula: true },
      ],
    },
    {
      moduleName: "Progresso das Lições",
      icon: BookOpen,
      permissions: [
        { action: "Visualizar Progresso de Todas as Casas de Paz", missionario: true, lider_de_celula: false },
        { action: "Gerenciar Progresso (Casas de Paz da Célula)", missionario: true, lider_de_celula: true },
      ],
    },
    {
      moduleName: "Relatórios",
      icon: BarChartBig,
      permissions: [
        { action: "Acessar Relatórios Gerais", missionario: true, lider_de_celula: 'dynamic_reports' },
      ],
    },
  ];

  function onSubmitEditProfile(values: EditProfileFormValues) {
    if (!user) return;

    const updatedUser = {
      ...user,
      name: values.name,
      email: values.email,
    };
    updateMockUser(updatedUser); 
    
    toast({
      title: "Perfil Atualizado!",
      description: "Seu nome e e-mail foram atualizados com sucesso.",
    });
    setIsEditProfileDialogOpen(false);
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-3xl font-semibold">Configurações</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 md:w-auto"> {/* Ajuste para 3 colunas em telas médias */}
          <TabsTrigger value="profile">
            <UserCircle className="mr-2 h-4 w-4" /> Meu Perfil
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Lock className="mr-2 h-4 w-4" /> Gerenciar Permissões
          </TabsTrigger>
          <TabsTrigger value="system_prefs"> {/* Nova Aba */}
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Preferências
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
                 <Dialog open={isEditProfileDialogOpen} onOpenChange={setIsEditProfileDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Editar Perfil
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="font-headline">Editar Perfil</DialogTitle>
                            <DialogDescription className="font-body">
                                Atualize seu nome e e-mail.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...editProfileForm}>
                            <form onSubmit={editProfileForm.handleSubmit(onSubmitEditProfile)} className="space-y-4 py-4">
                                <FormField
                                    control={editProfileForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <RHFFormLabel>Nome</RHFFormLabel>
                                            <FormControl>
                                                <Input placeholder="Seu nome completo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={editProfileForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <RHFFormLabel>E-mail</RHFFormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="seu@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter className="pt-4">
                                    <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                                    <Button type="submit">
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar Alterações
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                 </Dialog>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Visão Geral das Permissões por Papel</CardTitle>
              <CardDescription className="font-body">
                Entenda as capacidades e o nível de acesso de cada papel no sistema.
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
                         {roleKey === 'lider_de_celula' && (
                            <li className="flex items-start gap-2 text-sm">
                                <ListChecks className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                                <div>
                                <span className="font-medium">Acesso a Relatórios Gerais:</span>
                                <span className="text-muted-foreground ml-1">
                                    {appPermissions.liderPodeVerRelatorios ? "Habilitado pelo Administrador." : "Desabilitado pelo Administrador."}
                                </span>
                                </div>
                            </li>
                         )}
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
                      Controle de Acesso (Missionário)
                    </CardTitle>
                    <CardDescription className="font-body">
                        Ajuste permissões específicas para papéis.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <Switch
                        id="lider-pode-ver-relatorios"
                        checked={appPermissions.liderPodeVerRelatorios}
                        onCheckedChange={toggleLiderPodeVerRelatorios}
                        aria-labelledby="lider-pode-ver-relatorios-label"
                      />
                      <Label htmlFor="lider-pode-ver-relatorios" id="lider-pode-ver-relatorios-label" className="font-body cursor-pointer">
                        Permitir que Líderes de Célula acessem a página de Relatórios
                      </Label>
                    </div>
                     
                    <Dialog open={isDetailedPermissionsDialogOpen} onOpenChange={setIsDetailedPermissionsDialogOpen}>
                      <DialogTrigger asChild>
                         <Button variant="outline" className="mt-4" disabled={user.role !== 'missionario'}>
                            <Edit className="mr-2 h-4 w-4" />
                            Configurar Permissões Detalhadas (Demonstração)
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle className="font-headline text-xl flex items-center gap-2">
                            <SlidersHorizontal className="h-5 w-5" />
                            Configurações Detalhadas de Permissões (Demonstração)
                          </DialogTitle>
                          <DialogDescription className="font-body">
                            Esta é uma simulação de como as permissões granulares poderiam ser gerenciadas.
                            As alterações aqui são apenas visuais e não afetam o sistema real (exceto o acesso a relatórios para líderes, que é controlado acima).
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 max-h-[60vh] overflow-y-auto pr-3 space-y-6">
                          <Accordion type="multiple" className="w-full">
                            {detailedPermissionsConfig.map((module, moduleIndex) => {
                              const ModuleIcon = module.icon;
                              return (
                                <AccordionItem value={`module-${moduleIndex}`} key={module.moduleName}>
                                  <AccordionTrigger className="font-semibold text-md hover:no-underline">
                                    <div className="flex items-center gap-2">
                                      <ModuleIcon className="h-5 w-5 text-primary" />
                                      {module.moduleName}
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="w-[60%]">Ação</TableHead>
                                          <TableHead className="text-center">Missionário</TableHead>
                                          <TableHead className="text-center">Líder de Célula</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {module.permissions.map((perm, permIndex) => (
                                          <TableRow key={`${moduleIndex}-${permIndex}`}>
                                            <TableCell className="font-body">{perm.action}</TableCell>
                                            <TableCell className="text-center">
                                              <Checkbox checked={perm.missionario} disabled />
                                            </TableCell>
                                            <TableCell className="text-center">
                                              <Checkbox
                                                checked={
                                                  perm.lider_de_celula === 'dynamic_reports'
                                                    ? appPermissions.liderPodeVerRelatorios
                                                    : Boolean(perm.lider_de_celula)
                                                }
                                                disabled
                                              />
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            })}
                          </Accordion>
                        </div>
                        <DialogFooter className="mt-2">
                           <DialogClose asChild>
                            <Button type="button" variant="outline">Fechar</Button>
                           </DialogClose>
                          <Button
                            onClick={() => {
                              toast({
                                title: "Simulação",
                                description: "Configurações de permissão (simuladas) foram 'salvas'.",
                              });
                              setIsDetailedPermissionsDialogOpen(false);
                            }}
                          >
                            Salvar Alterações (Simulado)
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system_prefs" className="mt-6"> {/* Conteúdo da Nova Aba */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Preferências do Sistema</CardTitle>
              <CardDescription className="font-body">
                Personalize a aparência e outras configurações gerais do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Tema da Interface</Label>
                <RadioGroup
                  value={theme}
                  onValueChange={(value) => setTheme(value as Theme)}
                  className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4"
                >
                  <Label
                    htmlFor="theme-light"
                    className={`flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                                ${resolvedTheme === 'light' && theme === 'light' ? 'border-primary ring-2 ring-primary' : 'border-muted'}`}
                  >
                    <Sun className="h-6 w-6 mb-2" />
                    Claro
                    <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                  </Label>
                  <Label
                    htmlFor="theme-dark"
                    className={`flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                                ${resolvedTheme === 'dark' && theme === 'dark' ? 'border-primary ring-2 ring-primary' : 'border-muted'}`}
                  >
                    <Moon className="h-6 w-6 mb-2" />
                    Escuro
                    <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                  </Label>
                   <Label
                    htmlFor="theme-system"
                    className={`flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer
                                ${theme === 'system' ? 'border-primary ring-2 ring-primary' : 'border-muted'}`}
                  >
                    <Laptop className="h-6 w-6 mb-2" />
                    Sistema
                    <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                  </Label>
                </RadioGroup>
              </div>
               {/* Outras preferências podem ser adicionadas aqui no futuro */}
               <div className="p-6 border border-dashed rounded-lg text-muted-foreground mt-6">
                Mais opções de preferências serão adicionadas aqui no futuro, como configurações de notificação, idioma, etc.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
