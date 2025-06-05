
'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit3, ShieldAlert, Users } from "lucide-react"; // Added Users for new link
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { CellGroup } from "@/types"; // Import CellGroup

const myCellGroupSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres." }),
  meetingDay: z.string({ required_error: "Selecione o dia da reunião." }),
  meetingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Horário inválido (HH:MM)." }),
  geracao: z.string().optional(),
  // liderNome não é editável aqui diretamente, é o próprio usuário.
});

type MyCellGroupFormValues = z.infer<typeof myCellGroupSchema>;

const daysOfWeek = [
  "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"
];

export default function MyCellPage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Mock data da célula do líder - em um app real, viria do backend
  const [myCellData, setMyCellData] = useState<Partial<CellGroup>>({ // Use Partial<CellGroup>
    id: user?.cellGroupId,
    name: user?.cellGroupName || "Minha Célula",
    address: "Rua da Fé, 123, Bairro Esperança",
    meetingDay: "Quarta-feira",
    meetingTime: "19:30",
    liderNome: user?.name, // O nome do líder é o nome do usuário logado
    geracao: "G1 (Exemplo)", // Exemplo de geração
  });

  const form = useForm<MyCellGroupFormValues>({
    resolver: zodResolver(myCellGroupSchema),
    defaultValues: {
      name: myCellData.name,
      address: myCellData.address,
      meetingDay: myCellData.meetingDay,
      meetingTime: myCellData.meetingTime,
      geracao: myCellData.geracao,
    },
  });
  
  useEffect(() => {
    // Simular busca de dados da célula do líder se o user.cellGroupId existir
    if (user?.cellGroupId) {
        // Em um app real, você buscaria os dados da célula `user.cellGroupId` aqui
        // Por agora, vamos apenas atualizar com os dados do usuário e um mock.
        const mockFetchedCell: Partial<CellGroup> = {
            id: user.cellGroupId,
            name: user.cellGroupName || "Célula do Líder",
            address: "Endereço Mock da Célula",
            meetingDay: "Segunda-feira",
            meetingTime: "20:00",
            liderNome: user.name,
            geracao: "Geração X",
        };
        setMyCellData(mockFetchedCell);
        form.reset({
            name: mockFetchedCell.name,
            address: mockFetchedCell.address,
            meetingDay: mockFetchedCell.meetingDay,
            meetingTime: mockFetchedCell.meetingTime,
            geracao: mockFetchedCell.geracao,
        });
    } else {
        // Reset para valores padrão se não houver célula associada
        const defaultLeaderCellName = user?.name ? `Célula de ${user.name}` : "Minha Célula";
         setMyCellData(prev => ({
            ...prev,
            name: defaultLeaderCellName,
            liderNome: user?.name
         }));
         form.reset({
            name: defaultLeaderCellName,
            address: "Rua da Fé, 123, Bairro Esperança", // Mock default
            meetingDay: "Quarta-feira", // Mock default
            meetingTime: "19:30", // Mock default
            geracao: "G1 (Exemplo)", // Mock default
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, form.reset]);


  function onSubmitEdit(values: MyCellGroupFormValues) {
    console.log("Dados atualizados da Célula:", values);
    setMyCellData(prev => ({...prev, ...values, liderNome: user?.name})); // Atualiza mock local
    toast({
      title: "Sucesso!",
      description: "Dados da sua célula atualizados.",
    });
    setIsEditDialogOpen(false);
  }

  if (user?.role !== 'lider_de_celula') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="font-headline text-3xl font-semibold mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground">Esta página é destinada apenas a Líderes de Célula.</p>
      </div>
    );
  }
  
  if (!user.cellGroupId || !user.cellGroupName) {
     return (
      <div className="flex flex-col items-center justify-center h-full">
        <ShieldAlert className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="font-headline text-3xl font-semibold mb-2">Célula Não Associada</h1>
        <p className="text-muted-foreground text-center">Você não está associado a uma célula específica.<br/>Entre em contato com um administrador (Missionário).</p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold">Gerenciar Minha Célula: {myCellData.name}</h1>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit3 className="mr-2 h-4 w-4" /> Editar Dados da Célula
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="font-headline">Editar Dados da Célula: {myCellData.name}</DialogTitle>
              <DialogDescription className="font-body">
                Atualize os detalhes do seu grupo de célula.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4 py-4">
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Nome do Grupo</FormLabel><FormControl><Input placeholder="Ex: Discípulos de Cristo" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormItem><FormLabel>Nome do Líder</FormLabel><Input value={myCellData.liderNome || user?.name || ''} readOnly disabled /></FormItem>
                <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Endereço</FormLabel><FormControl><Input placeholder="Ex: Rua Exemplo, 123, Bairro" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="geracao" render={({ field }) => ( <FormItem><FormLabel>Geração da Célula</FormLabel><FormControl><Input placeholder="Ex: G1, Conquistadores" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="meetingDay" render={({ field }) => ( <FormItem><FormLabel>Dia da Reunião</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione o dia" /></SelectTrigger></FormControl><SelectContent>{daysOfWeek.map(day => (<SelectItem key={day} value={day}>{day}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="meetingTime" render={({ field }) => ( <FormItem><FormLabel>Horário (HH:MM)</FormLabel><FormControl><Input placeholder="Ex: 19:30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <DialogFooter className="pt-4">
                  <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                  <Button type="submit">Salvar Alterações</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader><CardTitle className="font-headline">Detalhes da Célula</CardTitle></CardHeader>
        <CardContent className="space-y-3">
            <p><strong className="font-medium">Nome:</strong> {myCellData.name}</p>
            <p><strong className="font-medium">Líder:</strong> {myCellData.liderNome || user?.name}</p>
            <p><strong className="font-medium">Endereço:</strong> {myCellData.address}</p>
            <p><strong className="font-medium">Geração:</strong> {myCellData.geracao || 'Não definida'}</p>
            <p><strong className="font-medium">Dia da Reunião:</strong> {myCellData.meetingDay}</p>
            <p><strong className="font-medium">Horário:</strong> {myCellData.meetingTime}</p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Vidas da Célula</CardTitle>
          <CardDescription className="font-body">
            Visualize as vidas associadas à sua célula. (Redireciona para Vidas com filtro aplicado)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="link" asChild>
            <Link href="/vidas"> 
              <Users className="mr-2 h-4 w-4"/> Ver Vidas da Célula
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
