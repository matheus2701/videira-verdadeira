
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { UserCircle, Network, ShieldAlert, Edit, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel as RHFFormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const editDescriptionSchema = z.object({
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres." }),
});
type EditDescriptionFormValues = z.infer<typeof editDescriptionSchema>;

const editProfileSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Formato de e-mail inválido." }),
});
type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export default function GeracaoVideiraPage() {
  const { mockUsers, user: currentUser, geracaoVideiraConfig, setGeracaoVideiraDescription, updateMockUser } = useAuth();
  const { toast } = useToast();
  const [isDescEditDialogOpen, setIsDescEditDialogOpen] = useState(false);
  const [isProfileEditDialogOpen, setIsProfileEditDialogOpen] = useState(false);

  const descriptionForm = useForm<EditDescriptionFormValues>({
    resolver: zodResolver(editDescriptionSchema),
    defaultValues: {
      description: geracaoVideiraConfig.description,
    },
  });

  const profileForm = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // Lógica para determinar 'responsavel'
  let responsavel = mockUsers.find(u => u.email === 'matheus.santos01@gmail.com' && u.role === 'missionario');
  if (!responsavel && currentUser?.role === 'missionario') {
    responsavel = currentUser;
  } else if (!responsavel && mockUsers.length > 0) {
    responsavel = mockUsers.find(u => u.role === 'missionario');
  }
  
  useEffect(() => {
    descriptionForm.reset({ description: geracaoVideiraConfig.description });
  }, [geracaoVideiraConfig.description, descriptionForm, isDescEditDialogOpen]);

  useEffect(() => {
    if (isProfileEditDialogOpen && responsavel) {
      profileForm.reset({
        name: responsavel.name,
        email: responsavel.email,
      });
    } else if (!isProfileEditDialogOpen) {
        profileForm.reset({ name: "", email: "" }); // Limpa o formulário se o diálogo for fechado
    }
  }, [isProfileEditDialogOpen, responsavel, profileForm]);


  if (!responsavel) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Network className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-3xl font-semibold">Geração Videira Verdadeira</h1>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-destructive" />
              Informação Indisponível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-muted-foreground">
              Não foi possível determinar o missionário responsável pela Geração Videira Verdadeira no momento.
              Verifique se há usuários com o papel 'missionario' cadastrados no sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const cargoResponsavel = "Missionário";

  function onSubmitEditDescription(values: EditDescriptionFormValues) {
    setGeracaoVideiraDescription(values.description);
    toast({
      title: "Sucesso!",
      description: "Descrição da Geração Videira Verdadeira atualizada.",
    });
    setIsDescEditDialogOpen(false);
  }

  function onSubmitEditProfile(values: EditProfileFormValues) {
    if (!responsavel) {
        toast({ title: "Erro", description: "Missionário responsável não encontrado para edição.", variant: "destructive" });
        return;
    }
    // Permite que o currentUser (se missionário) edite o 'responsavel' exibido.
    if (currentUser?.role !== 'missionario') {
        toast({ title: "Acesso Negado", description: "Apenas missionários podem editar perfis de responsáveis.", variant: "destructive" });
        return;
    }

    const updatedUserData = {
      ...responsavel,
      name: values.name,
      email: values.email,
    };
    updateMockUser(updatedUserData); // AuthContext lida com a atualização do user e do currentUser se necessário
    toast({
      title: "Perfil Atualizado!",
      description: `O perfil de ${responsavel.name} foi atualizado.`,
    });
    setIsProfileEditDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Network className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-3xl font-semibold">Geração Videira Verdadeira</h1>
        </div>
        {currentUser?.role === 'missionario' && (
          <Dialog open={isDescEditDialogOpen} onOpenChange={setIsDescEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" /> Editar Descrição
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-headline">Editar Descrição da Geração Videira</DialogTitle>
                <DialogDescription className="font-body">
                  Atualize o texto descritivo sobre a Geração Videira Verdadeira.
                </DialogDescription>
              </DialogHeader>
              <Form {...descriptionForm}>
                <form onSubmit={descriptionForm.handleSubmit(onSubmitEditDescription)} className="space-y-4 py-4">
                  <FormField
                    control={descriptionForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <RHFFormLabel>Descrição</RHFFormLabel>
                        <FormControl>
                          <Textarea placeholder="Descreva a visão e missão da Geração Videira..." {...field} rows={6} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="pt-4">
                    <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                    <Button type="submit"><Save className="mr-2 h-4 w-4" /> Salvar Descrição</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="shadow-lg max-w-md">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="https://placehold.co/100x100.png" alt={`Foto de ${responsavel.name}`} data-ai-hint="person portrait" />
            <AvatarFallback>
              {responsavel.name ? responsavel.name.substring(0, 2).toUpperCase() : 'VV'}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="font-headline text-2xl">
            {responsavel.name || <Skeleton className="h-8 w-48" />}
          </CardTitle>
          <CardDescription className="font-body text-md">
            {cargoResponsavel} Responsável
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          <div className="border-t pt-4">
            <h3 className="font-headline text-lg mb-2">Detalhes do Responsável</h3>
            <div className="space-y-2 font-body text-sm">
              <p>
                <strong className="font-medium">Nome:</strong> {responsavel.name || <Skeleton className="h-5 w-40 inline-block" />}
              </p>
              <p>
                <strong className="font-medium">Cargo:</strong> {cargoResponsavel}
              </p>
              <p>
                <strong className="font-medium">E-mail:</strong> {responsavel.email || <Skeleton className="h-5 w-52 inline-block" />}
              </p>
            </div>
          </div>
          <div className="border-t pt-4">
             <h3 className="font-headline text-lg mb-2">Sobre a Geração Videira Verdadeira</h3>
             <p className="font-body text-muted-foreground text-sm whitespace-pre-line">
                {geracaoVideiraConfig.description || <Skeleton className="h-20 w-full" />}
             </p>
          </div>
        </CardContent>
        {currentUser?.role === 'missionario' && responsavel && (
        <CardFooter className="flex-col items-start pt-4 border-t">
            <Dialog open={isProfileEditDialogOpen} onOpenChange={setIsProfileEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <UserCircle className="mr-2 h-4 w-4" /> Editar Perfil do Responsável
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-headline">Editar Perfil do Missionário Responsável</DialogTitle>
                <DialogDescription className="font-body">
                  Atualize o nome e e-mail de <span className="font-semibold">{responsavel.name}</span>.
                </DialogDescription>
              </DialogHeader>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSubmitEditProfile)} className="space-y-4 py-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <RHFFormLabel>Nome</RHFFormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <RHFFormLabel>E-mail</RHFFormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="pt-4">
                    <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                    <Button type="submit"><Save className="mr-2 h-4 w-4" /> Salvar Alterações</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardFooter>
        )}
      </Card>
    </div>
  );
}

    