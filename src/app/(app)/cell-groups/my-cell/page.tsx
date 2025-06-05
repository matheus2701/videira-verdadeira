
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
import { Edit3, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Esquema similar ao de cell-groups, mas focado na edição da PRÓPRIA célula
const myCellGroupSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres." }),
  meetingDay: z.string({ required_error: "Selecione o dia da reunião." }),
  meetingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Horário inválido (HH:MM)." }),
  // leaderName não é editável aqui, pois é o próprio usuário
});

type MyCellGroupFormValues = z.infer<typeof myCellGroupSchema>;

const daysOfWeek = [
  "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"
];

export default function MyCellPage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Mock data da célula do líder - em um app real, viria do backend
  const [myCellData, setMyCellData] = useState({
    name: user?.cellGroupName || "Minha Célula",
    address: "Rua da Fé, 123, Bairro Esperança",
    meetingDay: "Quarta-feira",
    meetingTime: "19:30",
    leaderName: user?.name || "Líder",
  });

  const form = useForm<MyCellGroupFormValues>({
    resolver: zodResolver(myCellGroupSchema),
    defaultValues: {
      name: myCellData.name,
      address: myCellData.address,
      meetingDay: myCellData.meetingDay,
      meetingTime: myCellData.meetingTime,
    },
  });
  
  // Resetar form se user mudar (para demo) ou myCellData mudar
  useState(() => {
    form.reset({
      name: myCellData.name,
      address: myCellData.address,
      meetingDay: myCellData.meetingDay,
      meetingTime: myCellData.meetingTime,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, myCellData, form.reset]);


  function onSubmitEdit(values: MyCellGroupFormValues) {
    console.log("Dados atualizados da Célula:", values);
    setMyCellData(prev => ({...prev, ...values})); // Atualiza mock local
    toast({
      title: "Sucesso!",
      description: "Dados da sua célula atualizados.",
    });
    setIsEditDialogOpen(false);
  }

  if (user?.role !== 'lider_de_celula') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="font-headline text-3xl font-semibold mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground">Esta página é destinada apenas a Líderes de Célula.</p>
      </div>
    );
  }
  
  if (!user.cellGroupId || !user.cellGroupName) {
     return (
      <div className="flex flex-col items-center justify-center h-full">
        <ShieldAlert className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="font-headline text-3xl font-semibold mb-2">Célula Não Associada</h1>
        <p className="text-muted-foreground text-center">Você não está associado a uma célula específica.<br/>Entre em contato com um administrador (Missionário).</p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold">Gerenciar Minha Célula: {myCellData.name}</h1>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit3 className="mr-2 h-4 w-4" /> Editar Dados da Célula
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="font-headline">Editar Dados da Célula: {myCellData.name}</DialogTitle>
              <DialogDescription className="font-body">
                Atualize os detalhes do seu grupo de célula.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4 py-4">
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
                <FormItem>
                  <FormLabel>Nome do Líder</FormLabel>
                  <Input value={myCellData.leaderName} readOnly disabled />
                </FormItem>
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
                  <Button type="submit">Salvar Alterações</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Detalhes da Célula</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <p><strong className="font-medium">Nome:</strong> {myCellData.name}</p>
            <p><strong className="font-medium">Líder:</strong> {myCellData.leaderName}</p>
            <p><strong className="font-medium">Endereço:</strong> {myCellData.address}</p>
            <p><strong className="font-medium">Dia da Reunião:</strong> {myCellData.meetingDay}</p>
            <p><strong className="font-medium">Horário:</strong> {myCellData.meetingTime}</p>
        </CardContent>
      </Card>

      {/* Outras seções relevantes para a célula do líder podem ser adicionadas aqui */}
      {/* Ex: Lista de membros da célula, ofertas da célula, CPs da célula */}
       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Membros da Célula</CardTitle>
          <CardDescription className="font-body">
            Visualize os membros associados à sua célula. (Redireciona para Membros com filtro aplicado)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/members">
            <Button variant="link">Ver Membros da Célula</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

