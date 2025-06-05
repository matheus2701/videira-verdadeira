
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
  const { user, mockCellGroups, updateMockCellGroup } = useAuth(); 

  const [myCellData, setMyCellData] = useState<Partial<CellGroup>>({});

  const form = useForm<MyCellGroupFormValues>({
    resolver: zodResolver(myCellGroupSchema),
    defaultValues: myCellData,
  });

  const statusForm = useForm<WeeklyStatusFormValues>({
    resolver: zodResolver(weeklyStatusSchema),
    defaultValues: {
        meetingStatus: myCellData?.meetingStatus || 'agendada',
        meetingStatusReason: myCellData?.meetingStatusReason || "",
        statusUpdateDate: myCellData?.lastStatusUpdate ? new Date(myCellData.lastStatusUpdate) : new Date(),
    }
  });
  
  useEffect(() => {
    if (user?.cellGroupId) {
        const currentCell = mockCellGroups.find(cg => cg.id === user.cellGroupId);
        if (currentCell) {
            setMyCellData(currentCell);
            form.reset({
                name: currentCell.name,
                address: currentCell.address,
                meetingDay: currentCell.meetingDay,
                meetingTime: currentCell.meetingTime,
                geracao: currentCell.geracao,
            });
            statusForm.reset({
                meetingStatus: currentCell.meetingStatus || 'agendada',
                meetingStatusReason: currentCell.meetingStatusReason || "",
                statusUpdateDate: currentCell.lastStatusUpdate ? new Date(currentCell.lastStatusUpdate) : new Date(),
            });
        } else {
            const defaultLeaderCellName = user?.name ? `Célula de ${user.name}` : "Minha Célula";
            const fallbackData: CellGroup = {
                id: user.cellGroupId, // Should have an ID
                name: defaultLeaderCellName,
                address: "Rua da Fé, 123, Bairro Esperança",
                meetingDay: "Quarta-feira",
                meetingTime: "19:30",
                liderNome: user.name,
                geracao: "G1 (Padrão)",
                meetingStatus: 'agendada',
                lastStatusUpdate: new Date(),
            };
            setMyCellData(fallbackData);
            form.reset({
                name: fallbackData.name,
                address: fallbackData.address,
                meetingDay: fallbackData.meetingDay,
                meetingTime: fallbackData.meetingTime,
                geracao: fallbackData.geracao,
            });
            statusForm.reset({
                meetingStatus: fallbackData.meetingStatus,
                meetingStatusReason: fallbackData.meetingStatusReason || "",
                statusUpdateDate: fallbackData.lastStatusUpdate ? new Date(fallbackData.lastStatusUpdate) : new Date(),
            });
        }
    } else if (user) { // User exists but no cellGroupId
         const defaultLeaderCellName = user?.name ? `Célula de ${user.name}` : "Minha Célula";
         const initialData = {
            name: defaultLeaderCellName,
            liderNome: user?.name,
            address: "Rua da Fé, 123, Bairro Esperança", 
            meetingDay: "Quarta-feira", 
            meetingTime: "19:30", 
            geracao: "G1 (Exemplo)", 
            meetingStatus: 'agendada' as CellMeetingStatus,
            lastStatusUpdate: new Date(),
         };
         setMyCellData(initialData);
         form.reset({
            name: initialData.name,
            address: initialData.address,
            meetingDay: initialData.meetingDay,
            meetingTime: initialData.meetingTime,
            geracao: initialData.geracao,
        });
        statusForm.reset({
            meetingStatus: initialData.meetingStatus,
            meetingStatusReason: "",
            statusUpdateDate: initialData.lastStatusUpdate,
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, mockCellGroups]); 


  function onSubmitEdit(values: MyCellGroupFormValues) {
    if (!user?.cellGroupId) {
      toast({ title: "Erro", description: "Nenhuma célula associada para atualizar.", variant: "destructive" });
      return;
    }
    const updatedCell: CellGroup = {
      ...myCellData,
      ...values,
      id: user.cellGroupId, 
      liderNome: user.name, 
      name: values.name, 
      address: values.address,
      meetingDay: values.meetingDay,
      meetingTime: values.meetingTime,
      geracao: values.geracao,
      // meetingStatus and reason are handled by the other form
    };
    updateMockCellGroup(updatedCell); 
    setMyCellData(updatedCell); 
    toast({
      title: "Sucesso!",
      description: "Dados da sua célula atualizados.",
    });
    setIsEditDialogOpen(false);
  }

  function onSubmitStatusUpdate(values: WeeklyStatusFormValues) {
    if (!user?.cellGroupId || !myCellData.id) {
        toast({ title: "Erro", description: "Célula não identificada para atualizar status.", variant: "destructive" });
        return;
    }
    const updatedCellWithStatus: CellGroup = {
        ...myCellData,
        id: myCellData.id, // Ensure ID is present
        name: myCellData.name!, // Ensure name is present
        address: myCellData.address!, // Ensure address is present
        meetingDay: myCellData.meetingDay!,
        meetingTime: myCellData.meetingTime!,
        meetingStatus: values.meetingStatus,
        meetingStatusReason: values.meetingStatusReason,
        lastStatusUpdate: values.statusUpdateDate,
    };
    updateMockCellGroup(updatedCellWithStatus);
    setMyCellData(updatedCellWithStatus);
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
  
  if (!user.cellGroupId) { 
     return (
      <div className="flex flex-col items-center justify-center h-full">
        <ShieldAlert className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="font-headline text-3xl font-semibold mb-2">Célula Não Associada</h1>
        <p className="text-muted-foreground text-center">Você não está associado a uma célula específica.<br/>Entre em contato com um administrador (Missionário).</p>
      </div>
    );
  }
  
  const showStatusReasonField = ['nao_aconteceu_com_aviso', 'nao_aconteceu_sem_aviso', 'cancelada_com_aviso'].includes(statusForm.watch('meetingStatus') || '');
  const currentStatusLabel = cellMeetingStatusOptions.find(opt => opt.value === myCellData.meetingStatus)?.label;


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
            <p><strong className="font-medium">Status da Última Reunião:</strong> {currentStatusLabel || 'Não informado'}</p>
            {myCellData.meetingStatusReason && <p><strong className="font-medium">Motivo:</strong> {myCellData.meetingStatusReason}</p>}
            {myCellData.lastStatusUpdate && <p><strong className="font-medium">Última Atualização de Status:</strong> {format(new Date(myCellData.lastStatusUpdate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>}
        </CardContent>
      </Card>

       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline">Atualização Semanal da Célula</CardTitle>
                <CardDescription className="font-body">
                    Registre o status da reunião da sua célula para esta semana.
                </CardDescription>
            </div>
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="secondary">
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
                {myCellData.meetingStatus === 'aconteceu' && <CheckSquare className="inline mr-2 h-5 w-5 text-green-600" />}
                {myCellData.meetingStatus && myCellData.meetingStatus !== 'aconteceu' && <XSquare className="inline mr-2 h-5 w-5 text-red-600" />}
                Status atual da reunião: <span className="font-semibold">{currentStatusLabel || 'Pendente de atualização'}</span>.
            </p>
            {myCellData.lastStatusUpdate && (
                 <p className="text-xs text-muted-foreground font-body mt-1">
                    Última atualização em: {format(new Date(myCellData.lastStatusUpdate), "dd/MM/yyyy", { locale: ptBR })}.
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
