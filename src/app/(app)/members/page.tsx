
'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const memberSchema = z.object({
  fullName: z.string().min(3, { message: "Nome completo deve ter pelo menos 3 caracteres." }),
  birthDate: z.date({ required_error: "Data de nascimento é obrigatória." }),
  contactPhone: z.string().min(10, { message: "Telefone de contato inválido." }).regex(/^\s*(\(?\d{2}\)?\s?)?(\d{4,5}-?\d{4})\s*$/, { message: "Formato de telefone inválido."}),
  cellGroupName: z.string().optional(), // Para missionários, pode ser qualquer célula. Para líderes, será a sua.
});

type MemberFormValues = z.infer<typeof memberSchema>;

export default function MembersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      fullName: "",
      birthDate: undefined,
      contactPhone: "",
      cellGroupName: user?.role === 'lider_de_celula' ? user.cellGroupName : "",
    },
  });
  
  // Atualizar defaultValues se o usuário mudar (para o switcher de demo)
  useState(() => {
     form.reset({
      fullName: "",
      birthDate: undefined,
      contactPhone: "",
      cellGroupName: user?.role === 'lider_de_celula' ? user.cellGroupName : "",
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, form.reset])


  function onSubmit(values: MemberFormValues) {
    const dataToSubmit = {
      ...values,
      // Se for líder, garantir que o nome da célula seja o dele
      cellGroupName: user?.role === 'lider_de_celula' ? user.cellGroupName : values.cellGroupName,
    };
    console.log("Dados do Membro:", dataToSubmit);
    toast({
      title: "Sucesso!",
      description: "Membro adicionado com sucesso.",
    });
    setIsDialogOpen(false);
    form.reset({
      fullName: "",
      birthDate: undefined,
      contactPhone: "",
      cellGroupName: user?.role === 'lider_de_celula' ? user.cellGroupName : "",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold">
          {user?.role === 'lider_de_celula' ? `Membros de ${user.cellGroupName || 'Minha Célula'}` : 'Diretório de Membros'}
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Membro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="font-headline">Adicionar Novo Membro</DialogTitle>
              <DialogDescription className="font-body">
                Preencha os detalhes abaixo para cadastrar um novo membro.
                {user?.role === 'lider_de_celula' && ` O membro será adicionado à célula ${user.cellGroupName}.`}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Maria Souza" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Nascimento</FormLabel>
                      <DatePicker 
                        date={field.value} 
                        setDate={field.onChange}
                        placeholder="Selecione a data"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contato (WhatsApp)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: (XX) XXXXX-XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cellGroupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {user?.role === 'lider_de_celula' ? 'Célula' : 'Nome da Célula (Opcional)'}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Discípulos de Cristo" 
                          {...field} 
                          disabled={user?.role === 'lider_de_celula'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">Salvar Membro</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            {user?.role === 'lider_de_celula' ? `Membros de ${user.cellGroupName || 'Minha Célula'}` : 'Lista de Todos os Membros'}
          </CardTitle>
          <CardDescription className="font-body">
            {user?.role === 'lider_de_celula' 
              ? `Visualize e gerencie os membros da sua célula: ${user.cellGroupName}.`
              : "Mantenha um diretório de indivíduos incluindo nomes, datas de nascimento, informações de contato (WhatsApp) e afiliações a grupos."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            {user?.role === 'lider_de_celula'
              ? `Lista de membros da célula "${user.cellGroupName || 'N/A'}" seria exibida aqui.`
              : 'Nenhum membro cadastrado ainda. Clique em "Adicionar Membro" para começar.'
            }
            {user?.role === 'lider_de_celula' && (!user.cellGroupName || !user.cellGroupId) && 
              <p className="text-destructive text-sm mt-2">Líder não associado a uma célula específica.</p>
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
