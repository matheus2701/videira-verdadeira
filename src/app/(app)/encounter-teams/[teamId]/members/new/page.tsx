
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import type { EncounterTeamMember } from "@/types"; // Removed EncounterTeamRole as it's covered by encounterTeamRoles
import { encounterTeamRoles } from "@/types";

const teamMemberFormSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  contact: z.string().optional(),
  teamRole: z.enum(encounterTeamRoles, { required_error: "Selecione a função na equipe." }),
  notes: z.string().optional(),
});

type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;

export default function NewEncounterTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;
  const { toast } = useToast();

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: "",
      contact: "",
      notes: "",
      // teamRole is required, so no need to set a default unless specific
    },
  });

  function onSubmit(data: TeamMemberFormValues) {
    const newMemberData: Partial<EncounterTeamMember> = {
      id: `member-${Date.now()}`, // Mock ID
      ...data,
      encounterTeamId: teamId, 
      addedAt: new Date(),
    }
    console.log("Dados do Novo Membro da Equipe de Encontro:", newMemberData);

    toast({
      title: "Membro Adicionado (Simulação)",
      description: `O membro "${data.name}" foi adicionado à equipe com a função ${data.teamRole}.`,
    });
    router.push(`/encounter-teams/${teamId}`); 
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <CardTitle className="text-2xl font-headline">Novo Membro para Equipe</CardTitle>
         <Button variant="outline" size="sm" onClick={() => router.back()}>
           <ArrowLeft className="mr-2 h-4 w-4" />
           Voltar
         </Button>
       </div>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardDescription className="font-body">Preencha os dados para adicionar um novo membro à equipe de encontro.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do membro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contato (Telefone/Email)</FormLabel>
                    <FormControl>
                      <Input placeholder="Informação de contato (opcional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função na Equipe</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {encounterTeamRoles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Alguma observação adicional (opcional)..." {...field} />
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
                  Salvar Membro na Equipe
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
