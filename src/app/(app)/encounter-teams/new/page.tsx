
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Save } from "lucide-react";
import type { EncounterTeam, CellGroup } from "@/types";

const encounterTeamFormSchema = z.object({
  name: z.string().min(3, { message: "O nome da equipe deve ter pelo menos 3 caracteres." }),
  eventDate: z.date().optional(),
  description: z.string().optional(),
  organizingCellGroupId: z.string().optional(),
});

type EncounterTeamFormValues = z.infer<typeof encounterTeamFormSchema>;

export default function NewEncounterTeamPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { mockCellGroups } = useAuth(); 

  const form = useForm<EncounterTeamFormValues>({
    resolver: zodResolver(encounterTeamFormSchema),
    defaultValues: {
      name: "",
      description: "",
      eventDate: undefined,
      organizingCellGroupId: undefined, 
    },
  });

  function onSubmit(data: EncounterTeamFormValues) {
    const selectedCell = data.organizingCellGroupId === "_none_" 
      ? undefined 
      : mockCellGroups.find(cg => cg.id === data.organizingCellGroupId);

    const newTeamData: Partial<EncounterTeam> = {
      id: `team-${Date.now()}`, 
      name: data.name,
      eventDate: data.eventDate,
      description: data.description,
      organizingCellGroupId: data.organizingCellGroupId === "_none_" ? undefined : data.organizingCellGroupId,
      organizingCellGroupName: selectedCell?.name,
      createdAt: new Date(),
    };
    console.log("Dados da Nova Equipe de Encontro:", newTeamData);
    // In a real app, you'd save this to a backend or context
    // e.g., addEncounterTeam(newTeamData); 
    // For now, new data is only logged and won't persist in the mock list on the main page unless that's also updated.

    toast({
      title: "Equipe de Encontro Salva (Simulação)",
      description: `A equipe "${data.name}" ${selectedCell ? `organizada pela célula ${selectedCell.name}` : ''} foi registrada no console.`,
    });
    router.push("/encounter-teams");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <CardTitle className="text-2xl font-headline">Nova Equipe do Encontro da Paz</CardTitle>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardDescription className="font-body">Preencha os dados para cadastrar uma nova equipe/evento de encontro.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Equipe/Evento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Encontro de Paz - Agosto 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organizingCellGroupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Célula Organizadora (Opcional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || "_none_"} // Ensure controlled component has a defined value
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a célula organizadora" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="_none_">Nenhuma</SelectItem>
                        {mockCellGroups
                          .filter(cell => cell && cell.id && cell.id !== "") // Defensive filter
                          .map((cell: CellGroup) => (
                          <SelectItem key={cell.id} value={cell.id}>
                            {cell.name} (Geração: {cell.geracao || 'N/A'})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data do Evento (Opcional)</FormLabel>
                     <DatePicker 
                        date={field.value} 
                        setDate={field.onChange}
                        placeholder="Escolha uma data"
                      />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detalhes sobre o evento, objetivos, etc..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Equipe
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
