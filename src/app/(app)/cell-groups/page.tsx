
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const cellGroupSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres." }),
  meetingDay: z.string({ required_error: "Selecione o dia da reunião." }),
  meetingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Horário inválido (HH:MM)." }),
  leaderName: z.string().min(3, { message: "Nome do líder deve ter pelo menos 3 caracteres." }),
});

type CellGroupFormValues = z.infer<typeof cellGroupSchema>;

const daysOfWeek = [
  "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"
];

export default function CellGroupsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<CellGroupFormValues>({
    resolver: zodResolver(cellGroupSchema),
    defaultValues: {
      name: "",
      address: "",
      meetingDay: undefined,
      meetingTime: "",
      leaderName: "",
    },
  });

  function onSubmit(values: CellGroupFormValues) {
    console.log("Dados do Grupo de Células:", values);
    toast({
      title: "Sucesso!",
      description: "Grupo de Células adicionado com sucesso.",
    });
    setIsDialogOpen(false);
    form.reset();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold">Gerenciar Grupos de Células</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Grupo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="font-headline">Adicionar Novo Grupo de Células</DialogTitle>
              <DialogDescription className="font-body">
                Preencha os detalhes abaixo para cadastrar um novo grupo.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Grupo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Discípulos de Cristo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="leaderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Líder</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: João da Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Rua Exemplo, 123, Bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="meetingDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dia da Reunião</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o dia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {daysOfWeek.map(day => (
                              <SelectItem key={day} value={day}>{day}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="meetingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário (HH:MM)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 19:30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">Salvar Grupo</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Lista de Grupos de Células</CardTitle>
          <CardDescription className="font-body">
            Interface intuitiva para gerenciar detalhes dos grupos de células, incluindo nome, endereço, dia/horário de reunião e atualizações semanais de status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder for table or list */}
          <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            Nenhum grupo de célula cadastrado ainda. Clique em "Adicionar Grupo" para começar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
