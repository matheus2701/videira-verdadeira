
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
import { ArrowLeft, Save, UserPlus } from 'lucide-react';

const newLiderSchema = z.object({
  vidaId: z.string({ required_error: 'Selecione uma Vida para promover.' }),
  novoStatus: z.enum(['lider_em_treinamento', 'lider_ativo'], {
    required_error: 'Selecione o novo status para o líder.',
  }),
  cellGroupId: z.string({ required_error: 'Selecione a célula que este líder irá liderar.' }),
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
    mockUsers, // Usaremos para verificar se um user já existe
    setUser, // Para atualizar o contexto se o usuário logado for promovido
    user: currentUser, // Para verificar se o usuário logado é a vida sendo promovida
    addMockUser, // Adicionaremos esta função ao AuthContext
    updateMockUser // Adicionaremos esta função ao AuthContext
} = useAuth();

  const form = useForm<NewLiderFormValues>({
    resolver: zodResolver(newLiderSchema),
    defaultValues: {
      vidaId: undefined,
      novoStatus: undefined,
      cellGroupId: undefined,
    },
  });

  const vidasElegiveis = mockVidas.filter(
    (v) => v.status === 'membro' || v.status === 'lider_em_treinamento'
  );

  const cellGroupsDisponiveis = mockCellGroups.filter(cg => cg && cg.id); // Filtra IDs vazios

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

    // 2. Se a célula selecionada já tinha um líder diferente, idealmente o status desse líder antigo seria revertido.
    // Por simplicidade no mock, apenas desvinculamos o antigo da célula específica.
    if (celulaSelecionada.liderVidaId && celulaSelecionada.liderVidaId !== vidaSelecionada.id) {
        const liderAntigoDaCelula = mockVidas.find(v => v.id === celulaSelecionada.liderVidaId);
        if (liderAntigoDaCelula) {
            // Opcional: Verifique se este líder antigo lidera outras células.
            // Se não, talvez reverter seu status para 'membro'.
            // Para o mock: console.log(`Líder anterior ${liderAntigoDaCelula.nomeCompleto} desvinculado da célula ${celulaSelecionada.name}.`);
        }
    }
    
    // 3. Atualizar a Célula com o novo líder
    const celulaAtualizada: CellGroup = {
      ...celulaSelecionada,
      liderVidaId: vidaSelecionada.id,
      liderNome: vidaSelecionada.nomeCompleto,
    };
    updateMockCellGroup(celulaAtualizada);
    
    // 4. Simular criação/atualização do User no AuthContext
    let userParaAuth = mockUsers.find(u => u.vidaId === vidaSelecionada.id);
    const userRole: Role = 'lider_de_celula';

    if (userParaAuth) { // Se já existe um User para esta Vida
      const updatedUser = {
        ...userParaAuth,
        role: userRole,
        cellGroupId: celulaAtualizada.id,
        cellGroupName: celulaAtualizada.name,
      };
      updateMockUser(updatedUser); // Função a ser adicionada no AuthContext
      if (currentUser && currentUser.id === updatedUser.id) {
        setUser(updatedUser); // Atualiza o usuário logado se for ele mesmo
      }
    } else { // Criar novo User
      const newUser: AuthUser = {
        id: `user-${vidaSelecionada.id}-${Date.now()}`,
        name: vidaSelecionada.nomeCompleto,
        email: `${vidaSelecionada.nomeCompleto.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '')}@videira.app`,
        role: userRole,
        vidaId: vidaSelecionada.id,
        cellGroupId: celulaAtualizada.id,
        cellGroupName: celulaAtualizada.name,
      };
      addMockUser(newUser); // Função a ser adicionada no AuthContext
      if (currentUser && currentUser.vidaId === newUser.vidaId) { // Caso raro onde o user logado era uma vida sem user associado.
        setUser(newUser);
      }
    }

    toast({
      title: 'Sucesso!',
      description: `${vidaSelecionada.nomeCompleto} foi definido como ${data.novoStatus.replace(/_/g, ' ')} da célula ${celulaSelecionada.name}.`,
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
            Selecione uma Vida, defina seu novo status de liderança e a célula que irá liderar.
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

