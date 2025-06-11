
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UserCircle, Network, ShieldAlert, Edit, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const editDescriptionSchema = z.object({
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres." }),
});

type EditDescriptionFormValues = z.infer<typeof editDescriptionSchema>;

export default function GeracaoVideiraPage() {
  const { mockUsers, user: currentUser, geracaoVideiraConfig, setGeracaoVideiraDescription } = useAuth();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<EditDescriptionFormValues>({
    resolver: zodResolver(editDescriptionSchema),
    defaultValues: {
      description: geracaoVideiraConfig.description,
    },
  });

  useEffect(() => {
    form.reset({ description: geracaoVideiraConfig.description });
  }, [geracaoVideiraConfig.description, form, isEditDialogOpen]);


  let responsavel = mockUsers.find(u => u.email === 'matheus.santos01@gmail.com' && u.role === 'missionario');
  
  if (!responsavel && currentUser?.role === 'missionario') {
    responsavel = currentUser;
  } else if (!responsavel) {
    responsavel = mockUsers.find(u => u.role === 'missionario');
  }


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
              Por favor, verifique as configurações de usuários no sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const nomeResponsavel = responsavel.name;
  const cargoResponsavel = "Missionário";

  function onSubmitEdit(values: EditDescriptionFormValues) {
    setGeracaoVideiraDescription(values.description);
    toast({
      title: "Sucesso!",
      description: "Descrição da Geração Videira Verdadeira atualizada.",
    });
    setIsEditDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Network className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-3xl font-semibold">Geração Videira Verdadeira</h1>
        </div>
        {currentUser?.role === 'missionario' && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
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
            <AvatarImage src="https://placehold.co/100x100.png" alt={`Foto de ${nomeResponsavel}`} data-ai-hint="person portrait" />
            <AvatarFallback>
              {nomeResponsavel ? nomeResponsavel.substring(0, 2).toUpperCase() : 'VV'}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="font-headline text-2xl">
            {nomeResponsavel || <Skeleton className="h-8 w-48" />}
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
                <strong className="font-medium">Nome:</strong> {nomeResponsavel || <Skeleton className="h-5 w-40 inline-block" />}
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
      </Card>
    </div>
  );
}
