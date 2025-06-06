
'use client';

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel as RHFFormLabel, FormMessage } from "@/components/ui/form"; // Renamed FormLabel
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { PlusCircle, ShieldAlert, Edit, UserCog, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { CellGroup, Vida, CellMeetingStatus } from "@/types";
import { cellMeetingStatusOptions } from "@/types";
import { Label } from "@/components/ui/label"; // Import standard Label

const cellGroupSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres." }),
  meetingDay: z.string({ required_error: "Selecione o dia da reunião." }),
  meetingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Horário inválido (HH:MM)." }),
  geracao: z.string().optional(),
  liderVidaId: z.string().optional(),
  meetingStatus: z.enum(['agendada', 'aconteceu', 'nao_aconteceu_com_aviso', 'nao_aconteceu_sem_aviso', 'cancelada_com_aviso']).optional(),
  meetingStatusReason: z.string().optional(),
});

type CellGroupFormValues = z.infer<typeof cellGroupSchema>;

const daysOfWeek = [
  "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"
];

export default function CellGroupsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCellGroup, setEditingCellGroup] = useState<CellGroup | null>(null);
  const { toast } = useToast();
  const { user, mockVidas, mockCellGroups, addMockCellGroup, updateMockCellGroup } = useAuth();

  const [searchTermName, setSearchTermName] = useState("");
  const [searchTermLeader, setSearchTermLeader] = useState("");
  const [searchTermGeneration, setSearchTermGeneration] = useState("");

  const form = useForm<CellGroupFormValues>({
    resolver: zodResolver(cellGroupSchema),
    defaultValues: {
      name: "",
      address: "",
      meetingDay: undefined,
      meetingTime: "",
      geracao: "",
      liderVidaId: undefined,
      meetingStatus: "agendada",
      meetingStatusReason: "",
    },
  });
  
  const filteredCellGroups = useMemo(() => {
    return mockCellGroups.filter(cg => 
      cg.name.toLowerCase().includes(searchTermName.toLowerCase()) &&
      (cg.liderNome || '').toLowerCase().includes(searchTermLeader.toLowerCase()) &&
      (cg.geracao || '').toLowerCase().includes(searchTermGeneration.toLowerCase())
    );
  }, [mockCellGroups, searchTermName, searchTermLeader, searchTermGeneration]);


  useEffect(() => {
    if (editingCellGroup) {
      form.reset({
        name: editingCellGroup.name,
        address: editingCellGroup.address,
        meetingDay: editingCellGroup.meetingDay,
        meetingTime: editingCellGroup.meetingTime,
        geracao: editingCellGroup.geracao,
        liderVidaId: editingCellGroup.liderVidaId,
        meetingStatus: editingCellGroup.meetingStatus || "agendada",
        meetingStatusReason: editingCellGroup.meetingStatusReason,
      });
      setIsDialogOpen(true);
    } else {
      form.reset({
        name: "", address: "", meetingDay: undefined, meetingTime: "", geracao: "", liderVidaId: undefined, meetingStatus: "agendada", meetingStatusReason: "",
      });
    }
  }, [editingCellGroup, form]);


  function onSubmit(values: CellGroupFormValues) {
    const liderSelecionado = mockVidas.find(v => v.id === values.liderVidaId && (v.status === 'lider_ativo' || v.status === 'lider_em_treinamento'));
    
    if (editingCellGroup) {
      const updatedCg: CellGroup = { 
        ...editingCellGroup, 
        ...values,
        liderNome: liderSelecionado?.nomeCompleto,
        meetingStatus: values.meetingStatus as CellMeetingStatus,
        lastStatusUpdate: new Date(),
      };
      updateMockCellGroup(updatedCg);
      toast({ title: "Sucesso!", description: "Grupo de Células atualizado." });
    } else {
      const newCellGroup: CellGroup = {
        id: `cg-${Date.now()}`,
        ...values,
        name: values.name,
        address: values.address,
        meetingDay: values.meetingDay,
        meetingTime: values.meetingTime,
        liderNome: liderSelecionado?.nomeCompleto,
        meetingStatus: values.meetingStatus as CellMeetingStatus,
        lastStatusUpdate: new Date(),
      };
      addMockCellGroup(newCellGroup);
      toast({ title: "Sucesso!", description: "Grupo de Células adicionado." });
    }
    setIsDialogOpen(false);
    setEditingCellGroup(null);
  }
  
  const handleEdit = (cellGroup: CellGroup) => {
    setEditingCellGroup(cellGroup);
  };

  if (user?.role === 'lider_de_celula') {
    return (
        <div className="space-y-6">
            <h1 className="font-headline text-3xl font-semibold">Gerenciar Grupos de Células</h1>
            <Card>
                <CardHeader><CardTitle className="font-headline">Acesso Restrito</CardTitle></CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center p-8">
                    <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
                    <p className="text-lg font-medium">Líderes de Célula devem gerenciar seus grupos através da seção "Minha Célula".</p>
                    <p className="text-muted-foreground">Esta visão geral é para administradores (Missionários).</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  const showReasonField = ['nao_aconteceu_com_aviso', 'nao_aconteceu_sem_aviso', 'cancelada_com_aviso'].includes(form.watch('meetingStatus') || '');


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold">Gerenciar Grupos de Células</h1>
        {user?.role === 'missionario' && (
          <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setEditingCellGroup(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingCellGroup(null); setIsDialogOpen(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" /> {editingCellGroup ? "Editar Grupo" : "Adicionar Grupo"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-headline">{editingCellGroup ? `Editar Grupo: ${editingCellGroup.name}` : "Adicionar Novo Grupo de Células"}</DialogTitle>
                <DialogDescription className="font-body">
                  Preencha os detalhes abaixo.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                  <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><RHFFormLabel>Nome do Grupo</RHFFormLabel><FormControl><Input placeholder="Ex: Discípulos de Cristo" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="liderVidaId" render={({ field }) => (
                    <FormItem>
                      <RHFFormLabel>Líder da Célula (Opcional)</RHFFormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione um líder (status Ativo/Treinamento)" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="">Nenhum</SelectItem>
                          {mockVidas.filter(v => v.status === 'lider_ativo' || v.status === 'lider_em_treinamento').map(lider => (
                            <SelectItem key={lider.id} value={lider.id}>{lider.nomeCompleto} ({lider.status.replace(/_/g,' ')})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><RHFFormLabel>Endereço</RHFFormLabel><FormControl><Input placeholder="Ex: Rua Exemplo, 123, Bairro" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="geracao" render={({ field }) => ( <FormItem><RHFFormLabel>Geração (Opcional)</RHFFormLabel><FormControl><Input placeholder="Ex: G1, Conquistadores" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="meetingDay" render={({ field }) => ( <FormItem><RHFFormLabel>Dia da Reunião</RHFFormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione o dia" /></SelectTrigger></FormControl><SelectContent>{daysOfWeek.map(day => (<SelectItem key={day} value={day}>{day}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="meetingTime" render={({ field }) => ( <FormItem><RHFFormLabel>Horário (HH:MM)</RHFFormLabel><FormControl><Input placeholder="Ex: 19:30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <FormField
                    control={form.control}
                    name="meetingStatus"
                    render={({ field }) => (
                      <FormItem>
                        <RHFFormLabel>Status da Reunião</RHFFormLabel>
                        <Select onValueChange={field.onChange} value={field.value || 'agendada'}>
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
                  {showReasonField && (
                    <FormField
                      control={form.control}
                      name="meetingStatusReason"
                      render={({ field }) => (
                        <FormItem>
                          <RHFFormLabel>Motivo do Status</RHFFormLabel>
                          <FormControl>
                            <Textarea placeholder="Descreva o motivo..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <DialogFooter className="pt-4 sticky bottom-0 bg-background pb-1">
                    <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                    <Button type="submit">{editingCellGroup ? "Salvar Alterações" : "Salvar Grupo"}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {user?.role === 'missionario' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5"/>
              <CardTitle className="font-headline">Filtros</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-name">Nome do Grupo</Label>
              <Input id="filter-name" placeholder="Buscar por nome..." value={searchTermName} onChange={(e) => setSearchTermName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-leader">Nome do Líder</Label>
              <Input id="filter-leader" placeholder="Buscar por líder..." value={searchTermLeader} onChange={(e) => setSearchTermLeader(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-generation">Geração</Label>
              <Input id="filter-generation" placeholder="Buscar por geração..." value={searchTermGeneration} onChange={(e) => setSearchTermGeneration(e.target.value)} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Lista de Grupos de Células</CardTitle>
          <CardDescription className="font-body">
            Interface para gerenciar detalhes dos grupos de células.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCellGroups.length === 0 ? (
            <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
              Nenhum grupo de célula cadastrado ou encontrado com os filtros atuais.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Líder</TableHead>
                  <TableHead>Geração</TableHead>
                  <TableHead>Dia/Hora</TableHead>
                  <TableHead>Status Reunião</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCellGroups.map((cg) => (
                  <TableRow key={cg.id}>
                    <TableCell className="font-medium">{cg.name}</TableCell>
                    <TableCell>{cg.liderNome || <span className="text-muted-foreground italic">Não definido</span>}</TableCell>
                    <TableCell>{cg.geracao || <span className="text-muted-foreground italic">N/A</span>}</TableCell>
                    <TableCell>{cg.meetingDay}, {cg.meetingTime}</TableCell>
                    <TableCell>{cellMeetingStatusOptions.find(opt => opt.value === cg.meetingStatus)?.label || <span className="text-muted-foreground italic">N/A</span>}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm" onClick={() => handleEdit(cg)}>
                        <Edit className="mr-1 h-3 w-3" /> Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
               <TableCaption>
                Exibindo {filteredCellGroups.length} de {mockCellGroups.length} grupos.
              </TableCaption>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


      