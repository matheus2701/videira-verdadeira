
'use client';

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel as RHFFormLabel, FormMessage } from "@/components/ui/form"; // Renamed FormLabel to avoid conflict
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { PlusCircle, Filter, HandCoins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/components/ui/label"; // Import standard Label

const offeringSchema = z.object({
  amount: z.coerce.number().positive({ message: "Valor deve ser positivo." }),
  date: z.date({ required_error: "Data da oferta é obrigatória." }),
  cellGroupName: z.string().optional(),
  notes: z.string().optional(),
});

type OfferingFormValues = z.infer<typeof offeringSchema>;

// Interface para o dado de oferta armazenado (com ID, se viesse do backend)
interface StoredOffering extends OfferingFormValues {
  id: string;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
const months = Array.from({ length: 12 }, (_, i) => ({
  value: (i + 1).toString(),
  label: format(new Date(0, i), "MMMM", { locale: ptBR }),
}));

// Mock data for offerings
const initialMockOfferings: StoredOffering[] = [
  { id: "off1", amount: 50, date: new Date(2024, 5, 5), cellGroupName: "Discípulos de Cristo", notes: "Oferta semanal" },
  { id: "off2", amount: 75, date: new Date(2024, 5, 12), cellGroupName: "Leões de Judá", notes: "Culto de domingo" },
  { id: "off3", amount: 60, date: new Date(2024, 6, 3), cellGroupName: "Discípulos de Cristo", notes: "" },
  { id: "off4", amount: 100, date: new Date(2024, 6, 10), cellGroupName: "Leões de Judá", notes: "Oferta especial" },
  { id: "off5", amount: 40, date: new Date(2024, 6, 17), cellGroupName: "Discípulos de Cristo", notes: "Para missões" },
  { id: "off6", amount: 80, date: new Date(currentYear, new Date().getMonth(), 1), cellGroupName: "Nova Geração", notes: "Oferta deste mês" },
  { id: "off7", amount: 120, date: new Date(currentYear, new Date().getMonth() -1, 15), cellGroupName: "Discípulos de Cristo", notes: "Oferta do mês passado" },
];


export default function OfferingsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [offerings, setOfferings] = useState<StoredOffering[]>(initialMockOfferings);
  const [filteredOfferings, setFilteredOfferings] = useState<StoredOffering[]>([]);
  const [totalFilteredAmount, setTotalFilteredAmount] = useState(0);

  const { toast } = useToast();
  const { user } = useAuth();

  const defaultMonth = (new Date().getMonth() + 1).toString();
  const defaultYear = new Date().getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth);
  const [selectedYear, setSelectedYear] = useState<string>(defaultYear);
  const [selectedCellGroup, setSelectedCellGroup] = useState<string>("todos");

  const uniqueCellGroups = useMemo(() => {
    const groups = new Set(offerings.map(o => o.cellGroupName).filter(Boolean) as string[]);
    return ["todos", ...Array.from(groups)];
  }, [offerings]);

  const form = useForm<OfferingFormValues>({
    resolver: zodResolver(offeringSchema),
    defaultValues: {
      amount: undefined,
      date: new Date(),
      cellGroupName: user?.role === 'lider_de_celula' ? user.cellGroupName : "",
      notes: "",
    },
  });
  
  useEffect(() => {
    form.reset({
      amount: undefined,
      date: new Date(),
      cellGroupName: user?.role === 'lider_de_celula' ? user.cellGroupName : "",
      notes: "",
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, form.reset]);

  useEffect(() => {
    let tempOfferings = [...offerings];

    // Filter by month and year
    if (selectedMonth && selectedYear) {
      tempOfferings = tempOfferings.filter(o => {
        const offeringDate = new Date(o.date);
        return (
          offeringDate.getFullYear() === parseInt(selectedYear) &&
          (offeringDate.getMonth() + 1) === parseInt(selectedMonth)
        );
      });
    }

    // Filter by cell group
    if (user?.role === 'missionario' && selectedCellGroup !== "todos") {
      tempOfferings = tempOfferings.filter(o => o.cellGroupName === selectedCellGroup);
    } else if (user?.role === 'lider_de_celula' && user.cellGroupName) {
      // Leaders always see only their cell's offerings
      tempOfferings = tempOfferings.filter(o => o.cellGroupName === user.cellGroupName);
    }
    
    setFilteredOfferings(tempOfferings);

    const total = tempOfferings.reduce((sum, o) => sum + o.amount, 0);
    setTotalFilteredAmount(total);

  }, [selectedMonth, selectedYear, selectedCellGroup, offerings, user]);


  function onSubmit(values: OfferingFormValues) {
    const newOffering: StoredOffering = {
      ...values,
      id: `off-${Date.now()}`, // Mock ID
      cellGroupName: user?.role === 'lider_de_celula' ? user.cellGroupName : values.cellGroupName,
    };
    console.log("Dados da Oferta:", newOffering);
    setOfferings(prev => [newOffering, ...prev]); // Add to mock data list
    toast({
      title: "Sucesso!",
      description: "Oferta registrada com sucesso.",
    });
    setIsDialogOpen(false);
    form.reset({ amount: undefined, date: new Date(), cellGroupName: user?.role === 'lider_de_celula' ? user.cellGroupName : "", notes: "" });
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold">Rastrear Ofertas</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Registrar Oferta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="font-headline">Registrar Nova Oferta</DialogTitle>
              <DialogDescription className="font-body">
                Preencha os detalhes abaixo para registrar uma nova oferta.
                {user?.role === 'lider_de_celula' && ` A oferta será registrada para a célula ${user.cellGroupName}.`}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <RHFFormLabel>Valor (R$)</RHFFormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Ex: 50.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <RHFFormLabel>Data da Oferta</RHFFormLabel>
                      <DatePicker 
                        date={field.value} 
                        setDate={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="cellGroupName"
                  render={({ field }) => (
                    <FormItem>
                       <RHFFormLabel>
                        {user?.role === 'lider_de_celula' ? 'Célula' : 'Nome da Célula (Opcional se geral)'}
                      </RHFFormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome da célula ofertante" 
                          {...field} 
                          disabled={user?.role === 'lider_de_celula'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <RHFFormLabel>Notas (Opcional)</RHFFormLabel>
                      <FormControl>
                        <Textarea placeholder="Alguma observação sobre a oferta..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">Salvar Oferta</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle className="font-headline">Filtros de Ofertas</CardTitle>
          </div>
          <CardDescription className="font-body">
            Selecione o período e a célula para visualizar as ofertas.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filter-month">Mês</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger id="filter-month">
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map(m => (
                  <SelectItem key={m.value} value={m.value} className="capitalize">{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filter-year">Ano</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="filter-year">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {user?.role === 'missionario' && (
            <div className="space-y-2">
              <Label htmlFor="filter-cellgroup">Grupo de Célula</Label>
              <Select value={selectedCellGroup} onValueChange={setSelectedCellGroup}>
                <SelectTrigger id="filter-cellgroup">
                  <SelectValue placeholder="Todas as células" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCellGroups.map(group => (
                    <SelectItem key={group} value={group}>
                      {group === "todos" ? "Todas as Células" : group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <div className="flex items-center gap-2">
                <HandCoins className="h-5 w-5 text-primary" />
                <CardTitle className="font-headline">
                {`Total de Ofertas (${months.find(m => m.value === selectedMonth)?.label || ''}/${selectedYear}${selectedCellGroup !== 'todos' && user?.role === 'missionario' ? ' - ' + selectedCellGroup : user?.role === 'lider_de_celula' && user.cellGroupName ? ' - ' + user.cellGroupName : ''})`}
                </CardTitle>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold font-headline">{formatCurrency(totalFilteredAmount)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Registro Detalhado de Ofertas</CardTitle>
          <CardDescription className="font-body">
            Lista de ofertas registradas para o período e célula selecionados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              {filteredOfferings.length === 0 
                ? "Nenhuma oferta encontrada para os filtros selecionados." 
                : `Exibindo ${filteredOfferings.length} registro(s).`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Célula</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOfferings.map((offering) => (
                <TableRow key={offering.id}>
                  <TableCell>{format(new Date(offering.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell>{offering.cellGroupName || "N/A"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(offering.amount)}</TableCell>
                  <TableCell>{offering.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


    