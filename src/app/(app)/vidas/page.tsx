
'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInYears } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { PlusCircle, Edit, ArrowUpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { Vida, VidaStatus } from "@/types";

const vidaSchema = z.object({
  nomeCompleto: z.string().min(3, { message: "Nome completo deve ter pelo menos 3 caracteres." }),
  dataNascimento: z.date({ required_error: "Data de nascimento é obrigatória." }),
  telefone: z.string().optional().refine(val => !val || val.length === 0 || val.length >= 10, { message: "Telefone inválido." }),
  idCelula: z.string({ required_error: "Célula é obrigatória." }),
  status: z.enum(['membro', 'lider_em_treinamento', 'lider_ativo'], { required_error: "Status é obrigatório." }),
});

type VidaFormValues = z.infer<typeof vidaSchema>;

export default function VidasPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVida, setEditingVida] = useState<Vida | null>(null);
  const { toast } = useToast();
  const { user, mockVidas, mockCellGroups, addMockVida, updateMockVida } = useAuth();

  const form = useForm<VidaFormValues>({
    resolver: zodResolver(vidaSchema),
    defaultValues: {
      nomeCompleto: "",
      dataNascimento: undefined,
      telefone: "",
      idCelula: user?.role === 'lider_de_celula' ? user.cellGroupId : undefined,
      status: "membro",
    },
  });

  useEffect(() => {
    if (user?.role === 'lider_de_celula') {
      form.reset({
        ...form.getValues(),
        idCelula: user.cellGroupId,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, form.reset]);

  useEffect(() => {
    if (editingVida) {
      form.reset({
        nomeCompleto: editingVida.nomeCompleto,
        dataNascimento: new Date(editingVida.dataNascimento),
        telefone: editingVida.telefone,
        idCelula: editingVida.idCelula,
        status: editingVida.status,
      });
      setIsDialogOpen(true);
    } else {
      form.reset({
        nomeCompleto: "",
        dataNascimento: undefined,
        telefone: "",
        idCelula: user?.role === 'lider_de_celula' ? user.cellGroupId : undefined,
        status: "membro",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingVida, user, form.reset]);


  function onSubmit(values: VidaFormValues) {
    const cell = mockCellGroups.find(c => c.id === values.idCelula);
    
    if (editingVida) {
      const updatedVida: Vida = { 
        ...editingVida, 
        ...values,
        nomeCompleto: values.nomeCompleto, // Explicitly map from form values
        dataNascimento: values.dataNascimento,
        telefone: values.telefone,
        idCelula: values.idCelula,
        status: values.status as VidaStatus,
        nomeCelula: cell?.name,
        geracaoCelula: cell?.geracao,
      };
      updateMockVida(updatedVida);
      toast({ title: "Sucesso!", description: "Vida atualizada com sucesso." });
    } else {
      const newVida: Vida = {
        id: `vida-${Date.now()}`,
        ...values,
        nomeCompleto: values.nomeCompleto, // Explicitly map
        dataNascimento: values.dataNascimento,
        status: values.status as VidaStatus,
        nomeCelula: cell?.name,
        geracaoCelula: cell?.geracao,
        createdAt: new Date()
      };
      addMockVida(newVida);
      toast({ title: "Sucesso!", description: "Vida adicionada com sucesso." });
    }
    
    setIsDialogOpen(false);
    setEditingVida(null);
  }

  const handleEdit = (vida: Vida) => {
    setEditingVida(vida);
  };
  
  const handlePromote = (vida: Vida) => {
    // Placeholder: Lógica de promoção/gerenciamento de liderança
    toast({ title: "Ação de Liderança", description: `Gerenciar liderança para ${vida.nomeCompleto}. (Em desenvolvimento)`});
  }

  const calculateAge = (birthDate: Date): number => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  const filteredVidas = user?.role === 'lider_de_celula' && user.cellGroupId 
    ? mockVidas.filter(v => v.idCelula === user.cellGroupId)
    : mockVidas;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold">
          {user?.role === 'lider_de_celula' ? `Vidas de ${user.cellGroupName || 'Minha Célula'}` : 'Diretório de Vidas'}
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setEditingVida(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingVida(null); setIsDialogOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Vida
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-headline">{editingVida ? "Editar Vida" : "Adicionar Nova Vida"}</DialogTitle>
              <DialogDescription className="font-body">
                Preencha os detalhes abaixo.
                {user?.role === 'lider_de_celula' && !editingVida && ` A vida será adicionada à célula ${user.cellGroupName}.`}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <FormField
                  control={form.control}
                  name="nomeCompleto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl><Input placeholder="Ex: Maria Souza" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dataNascimento"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Nascimento</FormLabel>
                      <DatePicker date={field.value} setDate={field.onChange} placeholder="Selecione a data" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contato (Telefone/WhatsApp)</FormLabel>
                      <FormControl><Input placeholder="Ex: (XX) XXXXX-XXXX" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="idCelula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Célula Vinculada</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={user?.role === 'lider_de_celula'}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a célula" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockCellGroups.filter(cell => cell && cell.id && cell.id !== "").map(cell => (
                            <SelectItem key={cell.id} value={cell.id}>{cell.name} (Geração: {cell.geracao || 'N/A'})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status da Vida</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="membro">Membro</SelectItem>
                          <SelectItem value="lider_em_treinamento">Líder em Treinamento</SelectItem>
                          <SelectItem value="lider_ativo">Líder Ativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4 sticky bottom-0 bg-background pb-1">
                  <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                  <Button type="submit">{editingVida ? "Salvar Alterações" : "Salvar Vida"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            {user?.role === 'lider_de_celula' ? `Vidas de ${user.cellGroupName || 'Minha Célula'}` : 'Listagem de Todas as Vidas'}
          </CardTitle>
          <CardDescription className="font-body">
            Visualize e gerencie as informações das vidas cadastradas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredVidas.length === 0 ? (
             <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
              Nenhuma vida cadastrada para os filtros atuais.
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Célula</TableHead>
                  <TableHead>Geração Célula</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVidas.map((vida) => (
                  <TableRow key={vida.id}>
                    <TableCell className="font-medium">{vida.nomeCompleto}</TableCell>
                    <TableCell>{calculateAge(vida.dataNascimento)}</TableCell>
                    <TableCell>{vida.nomeCelula || vida.idCelula}</TableCell>
                    <TableCell>{vida.geracaoCelula || 'N/A'}</TableCell>
                    <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            vida.status === 'lider_ativo' ? 'bg-green-100 text-green-700' :
                            vida.status === 'lider_em_treinamento' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                            {vida.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                    </TableCell>
                    <TableCell>{vida.telefone || "-"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handlePromote(vida)} disabled={user?.role === 'lider_de_celula'}>
                        <ArrowUpCircle className="mr-1 h-3 w-3" /> Liderança
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(vida)}>
                        <Edit className="mr-1 h-3 w-3" /> Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
               <TableCaption>
                Exibindo {filteredVidas.length} de {mockVidas.length} vidas.
                {user?.role === 'lider_de_celula' && (!user.cellGroupName || !user.cellGroupId) && 
                  <p className="text-destructive text-sm mt-2">Líder não associado a uma célula específica.</p>
                }
              </TableCaption>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

