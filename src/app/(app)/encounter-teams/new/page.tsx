
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
import { ArrowLeft, Save, UserCircle } from "lucide-react";
import type { EncounterTeam, User as AuthUser } from "@/types";

const encounterTeamFormSchema = z.object({
  name: z.string().min(3, { message: "O nome da equipe deve ter pelo menos 3 caracteres." }),
  eventDate: z.date().optional(),
  description: z.string().optional(),
  organizerUserId: z.string().optional(),
});

type EncounterTeamFormValues = z.infer<typeof encounterTeamFormSchema>;

export default function NewEncounterTeamPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { mockUsers } = useAuth(); 

  const form = useForm<EncounterTeamFormValues>({
    resolver: zodResolver(encounterTeamFormSchema),
    defaultValues: {
      name: "",
      description: "",
      eventDate: undefined,
      organizerUserId: "_none_", // Alterado para _none_
    },
  });

  function onSubmit(data: EncounterTeamFormValues) {
    const selectedOrganizer = data.organizerUserId === "_none_" || !data.organizerUserId
      ? undefined
      : mockUsers.find(u => u.id === data.organizerUserId);

    const newTeamData: EncounterTeam = { // Alterado para EncounterTeam
      id: `team-${Date.now()}`,
      name: data.name,
      eventDate: data.eventDate,
      description: data.description,
      organizerUserId: selectedOrganizer?.id,
      organizerUserName: selectedOrganizer?.name,
      createdAt: new Date(),
    };
    console.log("Dados da Nova Equipe de Encontro:", newTeamData);
    // In a real app, you'd save this to a backend or context
    // e.g., addEncounterTeam(newTeamData);
    
    toast({
      title: "Equipe de Encontro Salva (Simulação)",
      description: `A equipe "${data.name}" ${selectedOrganizer ? `organizada por ${selectedOrganizer.name}` : ''} foi registrada no console.`,
    });
    router.push("/encounter-teams");
  }

  const eligibleOrganizers = mockUsers.filter(
    u => u.role === 'missionario' || u.role === 'lider_de_celula'
  );

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
                name="organizerUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4" />
                      Organizador do Encontro (Opcional)
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "_none_"} // Garante que o value do Select corresponda a _none_ se undefined
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o organizador" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="_none_">Nenhum</SelectItem>
                        {eligibleOrganizers
                          .filter(user => user && user.id && user.id !== "") 
                          .map((user: AuthUser) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.role === 'missionario' ? 'Missionário' : 'Líder de Célula'})
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
