
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert, BarChartBig, Search, ListFilter, Activity } from "lucide-react";
import type { CellGroup, CellMeetingStatus } from '@/types';
import { cellMeetingStatusOptions } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface FormattedCellGroup extends CellGroup {
  formattedLastStatusUpdate?: string;
  statusLabel?: string;
}

export default function ReportsPage() {
  const { user, mockCellGroups } = useAuth();

  const [filterStatus, setFilterStatus] = useState<CellMeetingStatus | 'todos'>('todos');
  const [filterLider, setFilterLider] = useState('');
  const [filterGeracao, setFilterGeracao] = useState('');

  const [formattedCellGroups, setFormattedCellGroups] = useState<FormattedCellGroup[]>([]);

  const filteredAndSortedCellGroups = useMemo(() => {
    let groups = mockCellGroups
      .map(cg => ({
        ...cg,
        statusLabel: cellMeetingStatusOptions.find(opt => opt.value === cg.meetingStatus)?.label || 'N/A',
      }))
      .filter(cg => {
        const statusMatch = filterStatus === 'todos' || cg.meetingStatus === filterStatus;
        const liderMatch = filterLider === '' || (cg.liderNome || '').toLowerCase().includes(filterLider.toLowerCase());
        const geracaoMatch = filterGeracao === '' || (cg.geracao || '').toLowerCase().includes(filterGeracao.toLowerCase());
        return statusMatch && liderMatch && geracaoMatch;
      });
    
    // Sort by cell name
    groups.sort((a, b) => a.name.localeCompare(b.name));
    return groups;
  }, [mockCellGroups, filterStatus, filterLider, filterGeracao]);

  useEffect(() => {
    const groupsWithFormattedDates = filteredAndSortedCellGroups.map(cg => ({
      ...cg,
      formattedLastStatusUpdate: cg.lastStatusUpdate 
        ? format(new Date(cg.lastStatusUpdate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
        : 'N/A',
    }));
    setFormattedCellGroups(groupsWithFormattedDates);
  }, [filteredAndSortedCellGroups]);


  if (user?.role !== 'missionario') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="font-headline text-3xl font-semibold mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground text-center">
          {user?.role === 'lider_de_celula' 
            ? "Líderes de Célula não têm acesso à seção de relatórios gerais." 
            : "Você não tem permissão para acessar esta página."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold">Relatórios da Igreja</h1>
         {/* Could add a general "Export" button here in future */}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-xl">Relatório de Status das Células</CardTitle>
          </div>
          <CardDescription className="font-body">
            Visualize a situação atual de todas as células, incluindo o status da última reunião e informações de liderança.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
            <div>
              <Label htmlFor="filter-status" className="font-body">Status da Reunião</Label>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as CellMeetingStatus | 'todos')}>
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  {cellMeetingStatusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-lider" className="font-body">Nome do Líder</Label>
              <Input 
                id="filter-lider" 
                placeholder="Buscar por líder..." 
                value={filterLider} 
                onChange={(e) => setFilterLider(e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="filter-geracao" className="font-body">Geração da Célula</Label>
              <Input 
                id="filter-geracao" 
                placeholder="Buscar por geração..." 
                value={filterGeracao} 
                onChange={(e) => setFilterGeracao(e.target.value)}
              />
            </div>
          </div>

          {formattedCellGroups.length === 0 && !mockCellGroups.length ? (
             <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                Nenhuma célula cadastrada no sistema.
             </div>
          ) : formattedCellGroups.length === 0 ? (
             <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                Nenhuma célula encontrada com os filtros aplicados.
             </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Célula</TableHead>
                    <TableHead>Líder</TableHead>
                    <TableHead>Geração</TableHead>
                    <TableHead>Dia/Hora Reunião</TableHead>
                    <TableHead>Status Reunião</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Última Atualização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formattedCellGroups.map((cg) => (
                    <TableRow key={cg.id}>
                      <TableCell className="font-medium">{cg.name}</TableCell>
                      <TableCell>{cg.liderNome || <span className="italic text-muted-foreground">Não definido</span>}</TableCell>
                      <TableCell>{cg.geracao || <span className="italic text-muted-foreground">N/A</span>}</TableCell>
                      <TableCell>{cg.meetingDay}, {cg.meetingTime}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${
                          cg.meetingStatus === 'aconteceu' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' :
                          cg.meetingStatus === 'agendada' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200' :
                          cg.meetingStatus === 'nao_aconteceu_com_aviso' || cg.meetingStatus === 'nao_aconteceu_sem_aviso' || cg.meetingStatus === 'cancelada_com_aviso' ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {cg.statusLabel}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs max-w-xs truncate">{cg.meetingStatusReason || <span className="italic text-muted-foreground">N/A</span>}</TableCell>
                      <TableCell>
                        {cg.formattedLastStatusUpdate ? cg.formattedLastStatusUpdate : <Skeleton className="h-4 w-[100px]" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>
                  Exibindo {formattedCellGroups.length} de {mockCellGroups.length} célula(s).
                </TableCaption>
              </Table>
            </div>
          )}
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground font-body">
              Este relatório fornece uma visão geral do status de atividade das células.
            </p>
        </CardFooter>
      </Card>
      
      {/* Placeholder for future reports */}
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><BarChartBig className="h-5 w-5 text-primary/70" />Relatório de Crescimento de Vidas</CardTitle>
          <CardDescription className="font-body">
            (Em Desenvolvimento) Acompanhe o número de novas vidas ao longo do tempo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[150px] p-8 border border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground">
            Gráfico de crescimento de vidas será exibido aqui.
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
