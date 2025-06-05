
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
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const offeringSchema = z.object({
  amount: z.coerce.number().positive({ message: "Valor deve ser positivo." }),
  date: z.date({ required_error: "Data da oferta é obrigatória." }),
  cellGroupName: z.string().optional(),
  notes: z.string().optional(),
});

type OfferingFormValues = z.infer<typeof offeringSchema>;

export default function OfferingsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<OfferingFormValues>({
    resolver: zodResolver(offeringSchema),
    defaultValues: {
      amount: undefined,
      date: new Date(), // Default to today
      cellGroupName: "",
      notes: "",
    },
  });

  function onSubmit(values: OfferingFormValues) {
    console.log("Dados da Oferta:", values);
    toast({
      title: "Sucesso!",
      description: "Oferta registrada com sucesso.",
    });
    setIsDialogOpen(false);
    form.reset({ amount: undefined, date: new Date(), cellGroupName: "", notes: ""});
  }

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
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 50.00" {...field} />
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
                      <FormLabel>Data da Oferta</FormLabel>
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
                      <FormLabel>Célula (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da célula ofertante" {...field} />
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
                      <FormLabel>Notas (Opcional)</FormLabel>
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
          <CardTitle className="font-headline">Registro de Ofertas</CardTitle>
          <CardDescription className="font-body">
            Registre ofertas específicas de células com valor, data e notas; gere relatórios por data, célula ou totais gerais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder for table or list */}
          <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            Nenhuma oferta registrada ainda. Clique em "Registrar Oferta" para começar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
