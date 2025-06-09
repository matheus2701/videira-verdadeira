
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { Vida, CellGroup, User as AuthUser, VidaStatus, Role } from '@/types';
import { ArrowLeft, Save, UserPlus, KeyRound, Mail } from 'lucide-react';

const newLiderSchema = z.object({
  vidaId: z.string({ required_error: 'Selecione uma Vida para promover.' }),
  novoStatus: z.enum(['lider_em_treinamento', 'lider_ativo'], {
    required_error: 'Selecione o novo status para o líder.',
  }),
  cellGroupId: z.string({ required_error: 'Selecione a célula que este líder irá liderar.' }),
  email: z.string().email({ message: "Formato de e-mail inválido." }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres." }), // Mínimo para simular campo
});

type NewLiderFormValues = z.infer<typeof newLiderSchema>;

export default function NovoLiderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    mockVidas, 
    mockCellGroups, 
    updateMockVida, 
    updateMockCellGroup, 
    mockUsers, 
    setUser, 
    user: currentUser, 
    addMockUser, 
    updateMockUser
} = useAuth();

  const form = useForm<NewLiderFormValues>({
    resolver: zodResolver(newLiderSchema),
    defaultValues: {
      vidaId: undefined,
      novoStatus: undefined,
      cellGroupId: undefined,
      email: "",
      password: "",
    },
  });

  const vidasElegiveis = mockVidas.filter(
    (v) => v.status === 'membro' || v.status === 'lider_em_treinamento'
  );

  const cellGroupsDisponiveis = mockCellGroups.filter(cg => cg && cg.id);

  // Preencher o campo de e-mail se uma vida já tiver um usuário associado
  const selectedVidaId = form.watch('vidaId');
  useEffect(() => {
    if (selectedVidaId) {
      const vida = mockVidas.find(v => v.id === selectedVidaId);
      if (vida) {
        const existingUser = mockUsers.find(u => u.vidaId === vida.id);
        if (existingUser && existingUser.email) {
          form.setValue('email', existingUser.email);
        } else {
          // Opcional: Gerar e-mail padrão se não houver usuário, ou deixar em branco
           form.setValue('email', `${vida.nomeCompleto.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '')}@videira.app`);
        }
      }
    }
  }, [selectedVidaId, mockVidas, mockUsers, form]);


  function onSubmit(data: NewLiderFormValues) {
    const vidaSelecionada = mockVidas.find((v) => v.id === data.vidaId);
    const celulaSelecionada = mockCellGroups.find((cg) => cg.id === data.cellGroupId);

    if (!vidaSelecionada || !celulaSelecionada) {
      toast({
        title: 'Erro',
        description: 'Vida ou Célula selecionada não encontrada.',
        variant: 'destructive',
      });
      return;
    }

    // 1. Atualizar o status da Vida
    const vidaAtualizada: Vida = {
      ...vidaSelecionada,
      status: data.novoStatus as VidaStatus,
      idCelula: celulaSelecionada.id, 
      nomeCelula: celulaSelecionada.name,
      geracaoCelula: celulaSelecionada.geracao,
    };
    updateMockVida(vidaAtualizada);
    
    // 2. Atualizar a Célula com o novo líder
    const celulaAtualizada: CellGroup = {
      ...celulaSelecionada,
      liderVidaId: vidaSelecionada.id,
      liderNome: vidaSelecionada.nomeCompleto,
    };
    updateMockCellGroup(celulaAtualizada);
    
    // 3. Criar/atualizar o User no AuthContext
    let userParaAuth = mockUsers.find(u => u.vidaId === vidaSelecionada.id);
    const userRole: Role = 'lider_de_celula';

    if (userParaAuth) { 
      const updatedUser = {
        ...userParaAuth,
        name: vidaSelecionada.nomeCompleto, // Sincronizar nome
        email: data.email, // Usar e-mail do formulário
        role: userRole,
        cellGroupId: celulaAtualizada.id,
        cellGroupName: celulaAtualizada.name,
        isActive: true, // Garante que está ativo ao ser promovido/atualizado
      };
      updateMockUser(updatedUser); 
      if (currentUser && currentUser.id === updatedUser.id) {
        setUser(updatedUser); 
      }
    } else { 
      const newUser: AuthUser = {
        id: `user-${vidaSelecionada.id}-${Date.now()}`,
        name: vidaSelecionada.nomeCompleto,
        email: data.email, // Usar e-mail do formulário
        role: userRole,
        vidaId: vidaSelecionada.id,
        cellGroupId: celulaAtualizada.id,
        cellGroupName: celulaAtualizada.name,
        isActive: true, // Ativo por padrão
      };
      addMockUser(newUser); 
      if (currentUser && currentUser.vidaId === newUser.vidaId) { 
        setUser(newUser);
      }
    }

    toast({
      title: 'Sucesso!',
      description: `${vidaSelecionada.nomeCompleto} foi definido como ${data.novoStatus.replace(/_/g, ' ')} da célula ${celulaSelecionada.name}. Login: ${data.email}`,
    });
    router.push('/lideres');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <CardTitle className="text-2xl font-headline flex items-center">
            <UserPlus className="mr-2 h-6 w-6 text-primary" />
            Promover/Designar Novo Líder
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardDescription className="font-body">
            Selecione uma Vida, defina seu novo status, célula, e-mail e senha para acesso ao sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="vidaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vida a ser Promovida</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma Vida" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vidasElegiveis.length === 0 && <SelectItem value="_disabled_vidas_" disabled>Nenhuma vida elegível para promoção</SelectItem>}
                        {vidasElegiveis.map((vida) => (
                          <SelectItem key={vida.id} value={vida.id}>
                            {vida.nomeCompleto} (Célula: {vida.nomeCelula || 'N/A'}, Status: {vida.status.replace(/_/g, ' ')})
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
                name="novoStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Novo Status de Liderança</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o novo status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lider_em_treinamento">Líder em Treinamento</SelectItem>
                        <SelectItem value="lider_ativo">Líder Ativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cellGroupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Célula a ser Liderada</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a célula" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cellGroupsDisponiveis.length === 0 && <SelectItem value="_disabled_cells_" disabled>Nenhuma célula cadastrada</SelectItem>}
                        {cellGroupsDisponiveis.map((cg) => (
                          <SelectItem key={cg.id} value={cg.id}>
                            {cg.name} (Líder Atual: {cg.liderNome || 'Nenhum'})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="border-t pt-6 space-y-6">
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Credenciais de Acesso ao Sistema
                </p>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>E-mail (Login)</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="exemplo@videira.app" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>


              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Líder
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


    