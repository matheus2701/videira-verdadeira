
'use client';

import { useState, useEffect, useMemo } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Edit3, ShieldAlert, Users, CalendarCheck2, CheckSquare, XSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { CellGroup, CellMeetingStatus } from "@/types";
import { cellMeetingStatusOptions } from "@/types";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


const myCellGroupSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres." }),
  meetingDay: z.string({ required_error: "Selecione o dia da reunião." }),
  meetingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Horário inválido (HH:MM)." }),
  geracao: z.string().optional(),
});

type MyCellGroupFormValues = z.infer<typeof myCellGroupSchema>;

const weeklyStatusSchema = z.object({
    meetingStatus: z.enum(['agendada', 'aconteceu', 'nao_aconteceu_com_aviso', 'nao_aconteceu_sem_aviso', 'cancelada_com_aviso'], { required_error: "Status é obrigatório." }),
    meetingStatusReason: z.string().optional(),
    statusUpdateDate: z.date({ required_error: "Data da atualização é obrigatória."}),
}).refine(data => {
    const requiresReason = ['nao_aconteceu_com_aviso', 'nao_aconteceu_sem_aviso', 'cancelada_com_aviso'].includes(data.meetingStatus);
    return !requiresReason || (requiresReason && data.meetingStatusReason && data.meetingStatusReason.trim().length > 0);
}, {
    message: "Motivo é obrigatório para este status.",
    path: ["meetingStatusReason"],
});

type WeeklyStatusFormValues = z.infer<typeof weeklyStatusSchema>;


const daysOfWeek = [
  "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"
];

export default function MyCellPage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user, setUser, mockCellGroups, updateMockCellGroup } = useAuth(); 

  const currentCellDetails = useMemo(() => {
    if (user?.cellGroupId) {
      return mockCellGroups.find(cg => cg.id === user.cellGroupId);
    }
    return undefined;
  }, [user?.cellGroupId, mockCellGroups]);

  const myCellDataForForm = useMemo(() => {
    if (currentCellDetails) {
      return currentCellDetails;
    }
    // Se o líder não tem uma célula ainda, ou a célula não foi encontrada (improvável com mocks),
    // cria dados de fallback para exibição e para o formulário.
    if (user && user.role === 'lider_de_celula') {
      const defaultLeaderCellName = user.name ? `Célula de ${user.name}` : "Minha Célula (Nova)";
      return {
        id: user.cellGroupId || `temp-id-${user.id}`,
        name: defaultLeaderCellName,
        liderNome: user.name,
        address: "Defina o endereço", 
        meetingDay: "Defina o dia", 
        meetingTime: "00:00", 
        geracao: "", 
        meetingStatus: 'agendada' as CellMeetingStatus,
        lastStatusUpdate: new Date(),
      };
    }
    // Retorno para caso user seja null ou não líder, embora a página tenha guarda para isso.
    return {} as Partial<CellGroup>; 
  }, [currentCellDetails, user]);


  const form = useForm<MyCellGroupFormValues>({
    resolver: zodResolver(myCellGroupSchema),
    defaultValues: {}, // Será preenchido pelo useEffect
  });

  const statusForm = useForm<WeeklyStatusFormValues>({
    resolver: zodResolver(weeklyStatusSchema),
    defaultValues: {}, // Será preenchido pelo useEffect
  });
  
  useEffect(() => {
    // Reset forms quando myCellDataForForm (que depende de currentCellDetails e user) mudar.
    form.reset({
        name: myCellDataForForm.name || "",
        address: myCellDataForForm.address || "",
        meetingDay: myCellDataForForm.meetingDay || undefined,
        meetingTime: myCellDataForForm.meetingTime || "",
        geracao: myCellDataForForm.geracao || "",
    });
    statusForm.reset({
        meetingStatus: myCellDataForForm.meetingStatus || 'agendada',
        meetingStatusReason: myCellDataForForm.meetingStatusReason || "",
        statusUpdateDate: myCellDataForForm.lastStatusUpdate ? new Date(myCellDataForForm.lastStatusUpdate) : new Date(),
    });
  }, [myCellDataForForm, form, statusForm]); 


  function onSubmitEdit(values: MyCellGroupFormValues) {
    if (!user) return;

    const cellIdToUpdate = user.cellGroupId || myCellDataForForm.id;
    if (!cellIdToUpdate) {
         toast({ title: "Erro", description: "ID da célula não encontrado para atualização.", variant: "destructive" });
         return;
    }
    
    // Base os dados na célula atual ou nos dados do formulário de fallback
    const baseCellData = currentCellDetails || myCellDataForForm;

    const updatedCell: CellGroup = {
      ...baseCellData,
      ...values,
      id: cellIdToUpdate, 
      liderVidaId: user.vidaId, // Garante que o líder da célula é o usuário logado
      liderNome: user.name, 
      meetingStatus: baseCellData.meetingStatus || 'agendada',
      lastStatusUpdate: baseCellData.lastStatusUpdate || new Date(),
    };

    updateMockCellGroup(updatedCell); 

    // Se o nome da célula mudou e o usuário logado é o líder desta célula, atualize o user no AuthContext
    if (user.cellGroupId === updatedCell.id && user.cellGroupName !== updatedCell.name) {
        setUser({ ...user, cellGroupName: updatedCell.name });
    }
    // Se o líder não tinha cellGroupId (primeira edição de uma "nova" célula), atualize o user no AuthContext
    if (!user.cellGroupId && cellIdToUpdate.startsWith('temp-id-') && user.role === 'lider_de_celula') {
        // Idealmente, `updateMockCellGroup` poderia retornar o ID real da célula se fosse um novo cadastro.
        // Para o mock, se `addMockCellGroup` for usado para "novas" células de líder, isso seria mais limpo.
        // Por ora, se o ID é temporário, após salvar, o líder ainda não teria o ID da célula no seu objeto User.
        // Isso seria melhor tratado se `updateMockCellGroup` pudesse adicionar uma célula se `temp-id` for detectado.
        // Para esta refatoração, vamos assumir que updateMockCellGroup atualiza o User se ele já tem a célula.
        // Se era uma nova célula, o user precisa ter seu cellGroupId e cellGroupName atualizados.
        // Esta lógica pode ser melhorada no AuthContext.
         setUser({ ...user, cellGroupId: updatedCell.id, cellGroupName: updatedCell.name });
    }


    toast({
      title: "Sucesso!",
      description: "Dados da sua célula atualizados.",
    });
    setIsEditDialogOpen(false);
  }

  function onSubmitStatusUpdate(values: WeeklyStatusFormValues) {
    if (!user) return;
    const cellIdToUpdate = user.cellGroupId || myCellDataForForm.id;
    if (!cellIdToUpdate) {
        toast({ title: "Erro", description: "Célula não identificada para atualizar status.", variant: "destructive" });
        return;
    }
    const baseCellData = currentCellDetails || myCellDataForForm;

    const updatedCellWithStatus: CellGroup = {
        ...baseCellData,
        id: cellIdToUpdate,
        name: baseCellData.name!, 
        address: baseCellData.address!,
        meetingDay: baseCellData.meetingDay!,
        meetingTime: baseCellData.meetingTime!,
        liderVidaId: user.vidaId,
        liderNome: user.name,
        geracao: baseCellData.geracao,
        meetingStatus: values.meetingStatus,
        meetingStatusReason: values.meetingStatusReason,
        lastStatusUpdate: values.statusUpdateDate,
    };
    updateMockCellGroup(updatedCellWithStatus);
    toast({ title: "Sucesso!", description: "Status semanal da célula atualizado."});
    setIsStatusDialogOpen(false);
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
  
  // Se o líder não tem um cellGroupId E o myCellDataForForm.id não é um ID temporário,
  // significa que ele não tem célula associada e não estamos no fluxo de "criar a primeira célula".
  if (!user.cellGroupId && !myCellDataForForm.id?.startsWith('temp-id-')) { 
     return (
      <div className="flex flex-col items-center justify-center h-full">
        <ShieldAlert className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="font-headline text-3xl font-semibold mb-2">Célula Não Associada</h1>
        <p className="text-muted-foreground text-center">Você não está associado a uma célula específica.<br/>Pode ser necessário que um administrador (Missionário) crie sua célula ou o associe a uma existente, ou você pode preencher os dados abaixo para configurar sua célula.</p>
        {/* O formulário abaixo ainda funciona para permitir que ele crie/defina sua célula */}
      </div>
    );
  }
  
  const showStatusReasonField = ['nao_aconteceu_com_aviso', 'nao_aconteceu_sem_aviso', 'cancelada_com_aviso'].includes(statusForm.watch('meetingStatus') || '');
  const currentStatusLabel = cellMeetingStatusOptions.find(opt => opt.value === myCellDataForForm.meetingStatus)?.label;


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-2xl sm:text-3xl font-semibold">Gerenciar Minha Célula: {myCellDataForForm.name || "Nova Célula"}</h1>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Edit3 className="mr-2 h-4 w-4" /> {user.cellGroupId || myCellDataForForm.id?.startsWith('temp-id-') ? "Editar Dados" : "Configurar Célula"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="font-headline">
                {user.cellGroupId || myCellDataForForm.id?.startsWith('temp-id-') ? `Editar Dados da Célula: ${myCellDataForForm.name}` : "Configurar Nova Célula"}
              </DialogTitle>
              <DialogDescription className="font-body">
                Atualize os detalhes do seu grupo de célula.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4 py-4">
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Nome do Grupo</FormLabel><FormControl><Input placeholder="Ex: Discípulos de Cristo" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormItem><FormLabel>Nome do Líder</FormLabel><Input value={user?.name || ''} readOnly disabled /></FormItem>
                <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Endereço</FormLabel><FormControl><Input placeholder="Ex: Rua Exemplo, 123, Bairro" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="geracao" render={({ field }) => ( <FormItem><FormLabel>Geração da Célula</FormLabel><FormControl><Input placeholder="Ex: G1, Conquistadores" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <CardContent className="space-y-3 text-sm sm:text-base">
            <p><strong className="font-medium">Nome:</strong> {myCellDataForForm.name}</p>
            <p><strong className="font-medium">Líder:</strong> {user?.name}</p>
            <p><strong className="font-medium">Endereço:</strong> {myCellDataForForm.address}</p>
            <p><strong className="font-medium">Geração:</strong> {myCellDataForForm.geracao || 'Não definida'}</p>
            <p><strong className="font-medium">Dia da Reunião:</strong> {myCellDataForForm.meetingDay}</p>
            <p><strong className="font-medium">Horário:</strong> {myCellDataForForm.meetingTime}</p>
            <p><strong className="font-medium">Status da Última Reunião:</strong> {currentStatusLabel || 'Não informado'}</p>
            {myCellDataForForm.meetingStatusReason && <p><strong className="font-medium">Motivo:</strong> {myCellDataForForm.meetingStatusReason}</p>}
            {myCellDataForForm.lastStatusUpdate && <p><strong className="font-medium">Última Atualização de Status:</strong> {format(new Date(myCellDataForForm.lastStatusUpdate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>}
        </CardContent>
      </Card>

       <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div className="mb-2 sm:mb-0">
                <CardTitle className="font-headline">Atualização Semanal da Célula</CardTitle>
                <CardDescription className="font-body">
                    Registre o status da reunião da sua célula para esta semana.
                </CardDescription>
            </div>
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="secondary" size="sm" className="text-xs sm:text-sm self-start sm:self-center" disabled={!user.cellGroupId && !myCellDataForForm.id?.startsWith('temp-id-') && !currentCellDetails?.id}>
                        <CalendarCheck2 className="mr-2 h-4 w-4" /> Registrar Status
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-headline">Registrar Status da Reunião Semanal</DialogTitle>
                        <DialogDescription className="font-body">Informe como foi a reunião da sua célula.</DialogDescription>
                    </DialogHeader>
                    <Form {...statusForm}>
                        <form onSubmit={statusForm.handleSubmit(onSubmitStatusUpdate)} className="space-y-4 py-4">
                            <FormField
                                control={statusForm.control}
                                name="statusUpdateDate"
                                render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Data da Atualização</FormLabel>
                                    <DatePicker date={field.value} setDate={field.onChange} />
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={statusForm.control}
                                name="meetingStatus"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status da Reunião</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {cellMeetingStatusOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            {showStatusReasonField && (
                                <FormField
                                control={statusForm.control}
                                name="meetingStatusReason"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Motivo</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Descreva o motivo do status..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            )}
                            <DialogFooter className="pt-4">
                                <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                                <Button type="submit">Salvar Status</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
             <p className="text-sm text-muted-foreground font-body">
                {myCellDataForForm.meetingStatus === 'aconteceu' && <CheckSquare className="inline mr-2 h-5 w-5 text-green-600" />}
                {myCellDataForForm.meetingStatus && myCellDataForForm.meetingStatus !== 'aconteceu' && <XSquare className="inline mr-2 h-5 w-5 text-red-600" />}
                Status atual da reunião: <span className="font-semibold">{currentStatusLabel || 'Pendente de atualização'}</span>.
            </p>
            {myCellDataForForm.lastStatusUpdate && (
                 <p className="text-xs text-muted-foreground font-body mt-1">
                    Última atualização em: {format(new Date(myCellDataForForm.lastStatusUpdate), "dd/MM/yyyy", { locale: ptBR })}.
                </p>
            )}
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Vidas da Célula</CardTitle>
          <CardDescription className="font-body">
            Visualize as vidas associadas à sua célula.
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

