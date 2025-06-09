
'use client';

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod"; // Removido, usará de src/types
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel as RHFFormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { PlusCircle, Filter, HandCoins, CalendarDays } from "lucide-react"; // Adicionado CalendarDays
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/components/ui/label";
import { offeringSchema, type OfferingFormValues, type StoredOffering } from "@/types"; // Importado de src/types
import { Skeleton } from "@/components/ui/skeleton";


const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
const months = Array.from({ length: 12 }, (_, i) => ({
  value: (i + 1).toString(),
  label: format(new Date(0, i), "MMMM", { locale: ptBR }),
}));


export default function OfferingsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [offerings, setOfferings] = useState<StoredOffering[]>(initialMockOfferings); // Removido, usará do contexto
  const [filteredOfferings, setFilteredOfferings] = useState<StoredOffering[]>([]);
  const [totalFilteredAmount, setTotalFilteredAmount] = useState(0);
  const [formattedDates, setFormattedDates] = useState<Record<string, string>>({});


  const { toast } = useToast();
  const { user, mockOfferings, addMockOffering } = useAuth(); // Usar mockOfferings e addMockOffering do contexto

  const defaultMonth = (new Date().getMonth() + 1).toString();
  const defaultYear = new Date().getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonth);
  const [selectedYear, setSelectedYear] = useState<string>(defaultYear);
  const [selectedCellGroup, setSelectedCellGroup] = useState<string>("todos");

  const uniqueCellGroups = useMemo(() => {
    const groups = new Set(mockOfferings.map(o => o.cellGroupName).filter(Boolean) as string[]);
    return ["todos", ...Array.from(groups)];
  }, [mockOfferings]);

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
    let tempOfferings = [...mockOfferings];

    if (selectedMonth && selectedYear) {
      tempOfferings = tempOfferings.filter(o => {
        const offeringDate = new Date(o.date);
        return (
          offeringDate.getFullYear() === parseInt(selectedYear) &&
          (offeringDate.getMonth() + 1) === parseInt(selectedMonth)
        );
      });
    }

    if (user?.role === 'missionario' && selectedCellGroup !== "todos") {
      tempOfferings = tempOfferings.filter(o => o.cellGroupName === selectedCellGroup);
    } else if (user?.role === 'lider_de_celula' && user.cellGroupName) {
      tempOfferings = tempOfferings.filter(o => o.cellGroupName === user.cellGroupName);
    }
    
    setFilteredOfferings(tempOfferings);

    const total = tempOfferings.reduce((sum, o) => sum + o.amount, 0);
    setTotalFilteredAmount(total);

    // Hydration fix for dates in the table
    const newFormattedDates: Record<string, string> = {};
    tempOfferings.forEach(offering => {
      newFormattedDates[offering.id] = format(new Date(offering.date), "dd/MM/yyyy", { locale: ptBR });
    });
    setFormattedDates(newFormattedDates);

  }, [selectedMonth, selectedYear, selectedCellGroup, mockOfferings, user]);


  function onSubmit(values: OfferingFormValues) {
    const offeringDataToSubmit: OfferingFormValues = {
      ...values,
      cellGroupName: user?.role === 'lider_de_celula' ? user.cellGroupName : values.cellGroupName,
    };
    addMockOffering(offeringDataToSubmit); // Usar função do contexto
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
        <h1 className="font-headline text-2xl sm:text-3xl font-semibold">Rastrear Ofertas</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="text-xs sm:text-sm">
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
                  <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
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
                <TableHead><CalendarDays className="inline mr-1 h-4 w-4"/>Data</TableHead>
                <TableHead>Célula</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOfferings.map((offering) => (
                <TableRow key={offering.id}>
                  <TableCell>{formattedDates[offering.id] || <Skeleton className="h-4 w-24" />}</TableCell>
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
