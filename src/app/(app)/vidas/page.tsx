
'use client';

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInYears } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { PlusCircle, Edit, ArrowUpCircle, Filter, Search, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { Vida, VidaStatus } from "@/types";
import { vidaStatusOptions } from "@/types";

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

  const [searchTermName, setSearchTermName] = useState("");
  const [searchTermCellName, setSearchTermCellName] = useState("");
  const [filterStatus, setFilterStatus] = useState<VidaStatus | "todos">("todos");

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
    if (!editingVida) {
        form.reset({
            nomeCompleto: "",
            dataNascimento: undefined,
            telefone: "",
            idCelula: user?.role === 'lider_de_celula' ? user.cellGroupId : undefined,
            status: "membro",
        });
    }
  }, [user?.role, user?.cellGroupId, editingVida, form]);

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
       if (isDialogOpen && !editingVida) { 
         form.reset({
            nomeCompleto: "",
            dataNascimento: undefined,
            telefone: "",
            idCelula: user?.role === 'lider_de_celula' ? user.cellGroupId : undefined,
            status: "membro",
        });
       }
    }
  }, [editingVida, form, user?.role, user?.cellGroupId, isDialogOpen]);


  function onSubmit(values: VidaFormValues) {
    const cell = mockCellGroups.find(c => c.id === values.idCelula);
    
    if (editingVida) {
      const updatedVida: Vida = { 
        ...editingVida, 
        ...values,
        nomeCompleto: values.nomeCompleto, 
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
        nomeCompleto: values.nomeCompleto, 
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
    toast({ title: "Ação de Liderança", description: `Gerenciar liderança para ${vida.nomeCompleto}. (Em desenvolvimento)`});
  }

  const calculateAge = (birthDate: Date): number => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  const baseVidasList = useMemo(() => {
    return user?.role === 'lider_de_celula' && user.cellGroupId 
      ? mockVidas.filter(v => v.idCelula === user.cellGroupId)
      : mockVidas;
  }, [mockVidas, user?.role, user?.cellGroupId]);

  const filteredVidas = useMemo(() => {
    return baseVidasList.filter(vida => {
      const nameMatch = vida.nomeCompleto.toLowerCase().includes(searchTermName.toLowerCase());
      const cellNameMatch = user?.role === 'missionario' 
        ? (vida.nomeCelula || vida.idCelula || '').toLowerCase().includes(searchTermCellName.toLowerCase())
        : true; // Líderes não filtram por nome de célula aqui, pois já está pré-filtrado.
      const statusMatch = filterStatus === "todos" || vida.status === filterStatus;
      return nameMatch && cellNameMatch && statusMatch;
    });
  }, [baseVidasList, searchTermName, searchTermCellName, filterStatus, user?.role]);

  const allStatusOptions = [{ value: "todos", label: "Todos os Status" }, ...vidaStatusOptions];


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold">
          {user?.role === 'lider_de_celula' ? `Vidas de ${user.cellGroupName || 'Minha Célula'}` : 'Diretório de Vidas'}
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { 
            setIsDialogOpen(isOpen); 
            if (!isOpen) {
                setEditingVida(null); 
            }
        }}>
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
                      <Select onValueChange={field.onChange} value={field.value} disabled={user?.role === 'lider_de_celula' && !editingVida}>
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
                          {vidaStatusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
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
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5"/>
            <CardTitle className="font-headline">Filtros de Vidas</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="filter-vida-name" className="font-body">Nome da Vida</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                id="filter-vida-name" 
                placeholder="Buscar por nome..." 
                value={searchTermName} 
                onChange={(e) => setSearchTermName(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          {user?.role === 'missionario' && (
            <div className="space-y-1.5">
              <Label htmlFor="filter-cell-name" className="font-body">Nome da Célula</Label>
               <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                    id="filter-cell-name" 
                    placeholder="Buscar por célula..." 
                    value={searchTermCellName} 
                    onChange={(e) => setSearchTermCellName(e.target.value)} 
                    className="pl-8"
                />
              </div>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="filter-vida-status" className="font-body">Status da Vida</Label>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as VidaStatus | "todos")}>
              <SelectTrigger id="filter-vida-status">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                {allStatusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

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
          {baseVidasList.length === 0 ? (
             <div className="mt-4 p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center text-muted-foreground space-y-3">
                <Users className="w-12 h-12 text-primary/70" />
                <p className="font-medium">Nenhuma vida cadastrada ainda.</p>
                <p className="text-sm">Clique em "Adicionar Vida" para começar.</p>
             </div>
          ) : filteredVidas.length === 0 ? (
             <div className="mt-4 p-8 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
              Nenhuma vida encontrada com os filtros atuais.
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
                    <TableCell>{vida.geracaoCelula || <span className="italic text-muted-foreground">N/A</span>}</TableCell>
                    <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                            vida.status === 'lider_ativo' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' :
                            vida.status === 'lider_em_treinamento' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100'
                        }`}>
                            {vidaStatusOptions.find(opt => opt.value === vida.status)?.label || vida.status}
                        </span>
                    </TableCell>
                    <TableCell>{vida.telefone || <span className="italic text-muted-foreground">N/A</span>}</TableCell>
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
                Exibindo {filteredVidas.length} de {baseVidasList.length} vidas
                {user?.role === 'lider_de_celula' && (!user.cellGroupName || !user.cellGroupId) && 
                  <p className="text-destructive text-sm mt-2">Líder não associado a uma célula específica.</p>
                }.
                {mockVidas.length > baseVidasList.length && ` (Total geral: ${mockVidas.length} vidas).`}
              </TableCaption>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

