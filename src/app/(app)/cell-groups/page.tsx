
'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { PlusCircle, ShieldAlert, Edit, UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { CellGroup, Vida } from "@/types";

const cellGroupSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres." }),
  meetingDay: z.string({ required_error: "Selecione o dia da reunião." }),
  meetingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Horário inválido (HH:MM)." }),
  geracao: z.string().optional(),
  liderVidaId: z.string().optional(), // ID da Vida que é líder
});

type CellGroupFormValues = z.infer<typeof cellGroupSchema>;

const daysOfWeek = [
  "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"
];

// Mock Vidas (para selecionar líder)
const mockVidasLideres: Pick<Vida, 'id' | 'nomeCompleto' | 'status'>[] = [
    { id: 'vida1', nomeCompleto: 'Ana Silva', status: 'lider_ativo' },
    { id: 'vida_lider_potencial', nomeCompleto: 'Carlos Matos', status: 'lider_em_treinamento' },
];

// Mock initial Cell Groups
const initialMockCellGroups: CellGroup[] = [
    { id: 'celula-alpha-123', name: 'Discípulos de Cristo', address: 'Rua da Fé, 123', meetingDay: 'Quarta-feira', meetingTime: '19:30', geracao: 'G1', liderVidaId: 'vida1', liderNome: 'Ana Silva' },
    { id: 'celula-beta-456', name: 'Leões de Judá', address: 'Av. Esperança, 456', meetingDay: 'Quinta-feira', meetingTime: '20:00', geracao: 'G2' },
];


export default function CellGroupsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCellGroup, setEditingCellGroup] = useState<CellGroup | null>(null);
  const [cellGroups, setCellGroups] = useState<CellGroup[]>(initialMockCellGroups);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<CellGroupFormValues>({
    resolver: zodResolver(cellGroupSchema),
    defaultValues: {
      name: "",
      address: "",
      meetingDay: undefined,
      meetingTime: "",
      geracao: "",
      liderVidaId: undefined,
    },
  });

  useEffect(() => {
    if (editingCellGroup) {
      form.reset({
        name: editingCellGroup.name,
        address: editingCellGroup.address,
        meetingDay: editingCellGroup.meetingDay,
        meetingTime: editingCellGroup.meetingTime,
        geracao: editingCellGroup.geracao,
        liderVidaId: editingCellGroup.liderVidaId,
      });
      setIsDialogOpen(true);
    } else {
      form.reset({
        name: "", address: "", meetingDay: undefined, meetingTime: "", geracao: "", liderVidaId: undefined,
      });
    }
  }, [editingCellGroup, form]);


  function onSubmit(values: CellGroupFormValues) {
    const liderSelecionado = mockVidasLideres.find(v => v.id === values.liderVidaId);
    const cellGroupData: Omit<CellGroup, 'id'> & Partial<Pick<CellGroup, 'id'>> = {
      ...values,
      liderNome: liderSelecionado?.nomeCompleto,
    };

    if (editingCellGroup) {
      const updatedCg = { ...editingCellGroup, ...cellGroupData };
      setCellGroups(cellGroups.map(cg => cg.id === editingCellGroup.id ? updatedCg : cg));
      toast({ title: "Sucesso!", description: "Grupo de Células atualizado." });
    } else {
      const newCellGroup: CellGroup = {
        id: `cg-${Date.now()}`,
        ...cellGroupData,
        name: values.name,
        address: values.address,
        meetingDay: values.meetingDay,
        meetingTime: values.meetingTime,
      };
      setCellGroups(prev => [newCellGroup, ...prev]);
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
                  <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Nome do Grupo</FormLabel><FormControl><Input placeholder="Ex: Discípulos de Cristo" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="liderVidaId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Líder da Célula (Opcional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione um líder (status Ativo/Treinamento)" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value=" ">Nenhum</SelectItem>
                          {mockVidasLideres.filter(v => v.status === 'lider_ativo' || v.status === 'lider_em_treinamento').map(lider => (
                            <SelectItem key={lider.id} value={lider.id}>{lider.nomeCompleto} ({lider.status.replace('_',' ')})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Endereço</FormLabel><FormControl><Input placeholder="Ex: Rua Exemplo, 123, Bairro" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="geracao" render={({ field }) => ( <FormItem><FormLabel>Geração (Opcional)</FormLabel><FormControl><Input placeholder="Ex: G1, Conquistadores" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="meetingDay" render={({ field }) => ( <FormItem><FormLabel>Dia da Reunião</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione o dia" /></SelectTrigger></FormControl><SelectContent>{daysOfWeek.map(day => (<SelectItem key={day} value={day}>{day}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="meetingTime" render={({ field }) => ( <FormItem><FormLabel>Horário (HH:MM)</FormLabel><FormControl><Input placeholder="Ex: 19:30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
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
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Lista de Grupos de Células</CardTitle>
          <CardDescription className="font-body">
            Interface para gerenciar detalhes dos grupos de células.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cellGroups.length === 0 ? (
            <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
              Nenhum grupo de célula cadastrado ainda. Clique em "Adicionar Grupo" para começar.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Líder</TableHead>
                  <TableHead>Geração</TableHead>
                  <TableHead>Dia/Hora</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cellGroups.map((cg) => (
                  <TableRow key={cg.id}>
                    <TableCell className="font-medium">{cg.name}</TableCell>
                    <TableCell>{cg.liderNome || <span className="text-muted-foreground italic">Não definido</span>}</TableCell>
                    <TableCell>{cg.geracao || <span className="text-muted-foreground italic">N/A</span>}</TableCell>
                    <TableCell>{cg.meetingDay}, {cg.meetingTime}</TableCell>
                    <TableCell>{cg.address}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm" onClick={() => handleEdit(cg)}>
                        <Edit className="mr-1 h-3 w-3" /> Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
