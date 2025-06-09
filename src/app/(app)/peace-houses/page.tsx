
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
import { PlusCircle, Home } from "lucide-react"; // Adicionado Home
import { useToast } from "@/hooks/use-toast";

const peaceHouseSchema = z.object({
  responsibleCellGroup: z.string().min(3, { message: "Nome do grupo deve ter pelo menos 3 caracteres." }),
  scheduledDate: z.date({ required_error: "Data de agendamento é obrigatória." }),
  location: z.string().min(5, { message: "Local deve ter pelo menos 5 caracteres." }),
  hostName: z.string().min(3, { message: "Nome do anfitrião deve ter pelo menos 3 caracteres." }),
  hostContact: z.string().min(10, { message: "Contato do anfitrião inválido." }).regex(/^\s*(\(?\d{2}\)?\s?)?(\d{4,5}-?\d{4})\s*$/, { message: "Formato de telefone inválido."}),
  designatedTeams: z.string().optional(),
  expectedParticipants: z.coerce.number().int().nonnegative({ message: "Deve ser um número não negativo." }).optional(),
});

type PeaceHouseFormValues = z.infer<typeof peaceHouseSchema>;

export default function PeaceHousesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PeaceHouseFormValues>({
    resolver: zodResolver(peaceHouseSchema),
    defaultValues: {
      responsibleCellGroup: "",
      scheduledDate: undefined,
      location: "",
      hostName: "",
      hostContact: "",
      designatedTeams: "",
      expectedParticipants: undefined,
    },
  });

  function onSubmit(values: PeaceHouseFormValues) {
    console.log("Dados da Casa de Paz:", values);
    toast({
      title: "Sucesso!",
      description: "Casa de Paz agendada com sucesso (simulado).",
    });
    setIsDialogOpen(false);
    form.reset();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold flex items-center gap-2">
          <Home className="w-8 h-8 text-primary" /> Coordenação de Casas de Paz
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Agendar Casa de Paz
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-headline">Agendar Nova Casa de Paz</DialogTitle>
              <DialogDescription className="font-body">
                Preencha os detalhes abaixo para registrar o agendamento de uma nova Casa de Paz.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <FormField
                  control={form.control}
                  name="responsibleCellGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo de Célula Responsável</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Célula Leões de Judá" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="hostName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Anfitrião/Filho da Paz</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Família Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hostContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contato do Anfitrião/Filho da Paz</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: (XX) XXXXX-XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local da Casa de Paz</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Rua das Flores, 456, Centro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data Agendada</FormLabel>
                      <DatePicker 
                        date={field.value} 
                        setDate={field.onChange}
                        placeholder="Selecione a data do evento"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expectedParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nº de Participantes Esperados (Opcional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 10" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value,10))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="designatedTeams"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipes Designadas / Observações (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Nomes dos membros da equipe, materiais necessários, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4 sticky bottom-0 bg-background pb-1 z-10">
                  <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                  <Button type="submit">Salvar Agendamento</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Agendamentos de Casas de Paz</CardTitle>
          <CardDescription className="font-body">
            Visualize e gerencie as Casas de Paz agendadas. (Listagem em desenvolvimento)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground space-y-3">
            <Home className="w-12 h-12 text-primary/70" />
            <p className="font-medium">Nenhuma Casa de Paz agendada ou listada ainda.</p>
            <p className="text-sm">Clique em "Agendar Casa de Paz" para adicionar a primeira.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
