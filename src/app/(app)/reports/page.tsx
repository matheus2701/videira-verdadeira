
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert, BarChartBig, Activity, HandCoins, Download } from "lucide-react"; // Adicionado HandCoins e Download
import type { CellGroup, CellMeetingStatus, Vida, StoredOffering } from '@/types';
import { cellMeetingStatusOptions } from '@/types';
import { format, getYear, getMonth, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useToast } from '@/hooks/use-toast';


interface FormattedCellGroup extends CellGroup {
  formattedLastStatusUpdate?: string;
  statusLabel?: string;
}

const vidaGrowthChartConfig = {
  count: {
    label: "Novas Vidas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const offeringChartConfig = {
  totalAmount: {
    label: "Total Arrecadado",
    color: "hsl(var(--chart-2))", 
  },
} satisfies ChartConfig;

const reportMonths = [
  { value: "todos", label: "Todos os Meses" },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: format(new Date(2000, i, 1), "MMMM", { locale: ptBR }),
  }))
];


export default function ReportsPage() {
  const { user, mockCellGroups, mockVidas, mockOfferings } = useAuth();
  const { toast } = useToast();

  // Estados para Relatório de Status das Células
  const [filterStatus, setFilterStatus] = useState<CellMeetingStatus | 'todos'>('todos');
  const [filterLider, setFilterLider] = useState('');
  const [filterGeracao, setFilterGeracao] = useState('');
  const [formattedCellGroups, setFormattedCellGroups] = useState<FormattedCellGroup[]>([]);
  const [totalVidasNoAno, setTotalVidasNoAno] = useState<number | null>(null);
  const [totalOfertasNoAno, setTotalOfertasNoAno] = useState<string | null>(null);


  // Estados para Relatório de Crescimento de Vidas
  const [selectedGrowthYear, setSelectedGrowthYear] = useState<string>(() => getYear(new Date()).toString());
  const [availableGrowthYears, setAvailableGrowthYears] = useState<string[]>([]);

  // Estados para Relatório Financeiro de Ofertas
  const [selectedReportOfferingYear, setSelectedReportOfferingYear] = useState<string>(() => getYear(new Date()).toString());
  const [selectedReportOfferingMonth, setSelectedReportOfferingMonth] = useState<string>("todos");
  const [availableReportOfferingYears, setAvailableReportOfferingYears] = useState<string[]>([]);
  const [totalOfferingsForPeriodDisplay, setTotalOfferingsForPeriodDisplay] = useState<string | null>(null);


  // Lógica para Relatório de Status das Células
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

  // Lógica para Relatório de Crescimento de Vidas
  useEffect(() => {
    if (mockVidas.length > 0) {
      const years = new Set(mockVidas.map(vida => getYear(new Date(vida.createdAt)).toString()));
      const sortedYears = Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
      setAvailableGrowthYears(sortedYears);
      if (!sortedYears.includes(selectedGrowthYear) && sortedYears.length > 0) {
        setSelectedGrowthYear(sortedYears[0]);
      } else if (sortedYears.length === 0 && !sortedYears.includes(selectedGrowthYear)) {
        setSelectedGrowthYear(getYear(new Date()).toString());
      }
    } else {
        setAvailableGrowthYears([getYear(new Date()).toString()]);
    }
  }, [mockVidas, selectedGrowthYear]);

  const vidasGrowthChartData = useMemo(() => {
    const year = parseInt(selectedGrowthYear);
    const monthlyCounts = Array(12).fill(0).map((_, index) => ({
      month: format(new Date(year, index), "MMM", { locale: ptBR }),
      count: 0,
    }));

    let countForYear = 0;
    mockVidas.forEach(vida => {
      const vidaDate = new Date(vida.createdAt);
      if (getYear(vidaDate) === year) {
        const monthIndex = getMonth(vidaDate);
        monthlyCounts[monthIndex].count++;
        countForYear++;
      }
    });
    setTotalVidasNoAno(countForYear);
    return monthlyCounts;
  }, [mockVidas, selectedGrowthYear]);

  // Lógica para Relatório Financeiro de Ofertas
  useEffect(() => {
    if (mockOfferings.length > 0) {
      const years = new Set(mockOfferings.map(offering => getYear(new Date(offering.date)).toString()));
      const sortedYears = Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
      setAvailableReportOfferingYears(sortedYears);
      if (!sortedYears.includes(selectedReportOfferingYear) && sortedYears.length > 0) {
        setSelectedReportOfferingYear(sortedYears[0]);
      } else if (sortedYears.length === 0 && !sortedYears.includes(selectedReportOfferingYear)) {
         setSelectedReportOfferingYear(getYear(new Date()).toString());
      }
    } else {
        setAvailableReportOfferingYears([getYear(new Date()).toString()]);
    }
  }, [mockOfferings, selectedReportOfferingYear]);
  
  const filteredReportOfferings = useMemo(() => {
    return mockOfferings.filter(offering => {
      const offeringDate = new Date(offering.date);
      const yearMatch = getYear(offeringDate) === parseInt(selectedReportOfferingYear);
      const monthMatch = selectedReportOfferingMonth === "todos" || (getMonth(offeringDate) + 1) === parseInt(selectedReportOfferingMonth);
      return yearMatch && monthMatch;
    });
  }, [mockOfferings, selectedReportOfferingYear, selectedReportOfferingMonth]);

  useEffect(() => {
    const totalForYear = mockOfferings
      .filter(o => getYear(new Date(o.date)) === parseInt(selectedReportOfferingYear))
      .reduce((sum, o) => sum + o.amount, 0);
    setTotalOfertasNoAno(totalForYear.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
  }, [mockOfferings, selectedReportOfferingYear]);

  const reportOfferingChartData = useMemo(() => {
    const year = parseInt(selectedReportOfferingYear);
    const monthlyTotals = Array(12).fill(0).map((_, index) => ({
      month: format(new Date(year, index), "MMM", { locale: ptBR }),
      totalAmount: 0,
    }));

    filteredReportOfferings.forEach(offering => {
        const offeringDate = new Date(offering.date);
        if (getYear(offeringDate) === year) { 
            const monthIndex = getMonth(offeringDate);
            monthlyTotals[monthIndex].totalAmount += offering.amount;
        }
    });

    if(selectedReportOfferingMonth !== "todos") {
        const singleMonthIndex = parseInt(selectedReportOfferingMonth) -1;
        if (singleMonthIndex >= 0 && singleMonthIndex < 12) { // Check index validity
            return [monthlyTotals[singleMonthIndex]];
        }
        return []; // Return empty if month index is invalid
    }
    return monthlyTotals;
  }, [filteredReportOfferings, selectedReportOfferingYear, selectedReportOfferingMonth]);
  
  useEffect(() => {
    const total = filteredReportOfferings.reduce((sum, o) => sum + o.amount, 0);
    setTotalOfferingsForPeriodDisplay(total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
  }, [filteredReportOfferings]);

  // Função para download de CSV
  const downloadCSV = (data: any[], filename: string, headersMap?: Record<string, string>) => {
    if (!data || data.length === 0) {
      toast({
        title: "Nenhum Dado",
        description: "Não há dados para exportar com os filtros atuais.",
        variant: "destructive",
      });
      return;
    }

    const csvRows = [];
    const headers = headersMap ? Object.values(headersMap) : Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = (headersMap ? Object.keys(headersMap) : Object.keys(data[0])).map(key => {
        const rawValue = row[key];
        // Se o valor for uma data, formatar. Adicionar mais formatações se necessário.
        let value = rawValue;
        if (rawValue instanceof Date) {
          value = format(rawValue, "dd/MM/yyyy", { locale: ptBR });
        } else if (key === 'amount' && typeof rawValue === 'number') { // Formatar valor monetário
           value = rawValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        
        const escaped = ('' + (value ?? '')).replace(/"/g, '""'); // Lidar com undefined/null
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' }); // Adiciona BOM para Excel
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Download Iniciado",
        description: `${filename} está sendo baixado.`,
      });
    }
  };

  const handleDownloadCellStatusCSV = () => {
    const dataToExport = formattedCellGroups.map(cg => ({
      nome: cg.name,
      lider: cg.liderNome || 'N/A',
      geracao: cg.geracao || 'N/A',
      diaHora: `${cg.meetingDay || ''}, ${cg.meetingTime || ''}`,
      status: cg.statusLabel || 'N/A',
      motivo: cg.meetingStatusReason || '',
      ultimaAtualizacao: cg.formattedLastStatusUpdate || 'N/A',
    }));
    const headers = {
      nome: "Nome da Célula",
      lider: "Líder",
      geracao: "Geração",
      diaHora: "Dia/Hora Reunião",
      status: "Status Reunião",
      motivo: "Motivo",
      ultimaAtualizacao: "Última Atualização"
    };
    downloadCSV(dataToExport, "relatorio_status_celulas.csv", headers);
  };

  const handleDownloadOfferingsCSV = () => {
    const dataToExport = filteredReportOfferings.map(o => ({
      date: o.date, // Será formatado dentro de downloadCSV
      cellGroupName: o.cellGroupName || 'Oferta Geral',
      amount: o.amount, // Será formatado dentro de downloadCSV
      notes: o.notes || '',
    }));
     const headers = {
      date: "Data",
      cellGroupName: "Célula/Origem",
      amount: "Valor (R$)",
      notes: "Notas"
    };
    downloadCSV(dataToExport, `relatorio_ofertas_${selectedReportOfferingMonth}_${selectedReportOfferingYear}.csv`, headers);
  };


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
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-xl">Relatório de Status das Células</CardTitle>
          </div>
          <CardDescription className="font-body">
            Visualize a situação atual de todas as células.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
            <div>
              <Label htmlFor="filter-status" className="font-body">Status da Reunião</Label>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as CellMeetingStatus | 'todos')}>
                <SelectTrigger id="filter-status"><SelectValue placeholder="Filtrar por status" /></SelectTrigger>
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
              <Input id="filter-lider" placeholder="Buscar por líder..." value={filterLider} onChange={(e) => setFilterLider(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="filter-geracao" className="font-body">Geração da Célula</Label>
              <Input id="filter-geracao" placeholder="Buscar por geração..." value={filterGeracao} onChange={(e) => setFilterGeracao(e.target.value)} />
            </div>
          </div>
          {formattedCellGroups.length === 0 && !mockCellGroups.length ? (
             <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">Nenhuma célula cadastrada.</div>
          ) : formattedCellGroups.length === 0 ? (
             <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">Nenhuma célula encontrada.</div>
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
                        }`}>{cg.statusLabel}</span>
                      </TableCell>
                      <TableCell className="text-xs max-w-xs truncate">{cg.meetingStatusReason || <span className="italic text-muted-foreground">N/A</span>}</TableCell>
                      <TableCell>{cg.formattedLastStatusUpdate ? cg.formattedLastStatusUpdate : <Skeleton className="h-4 w-[100px]" />}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>Exibindo {formattedCellGroups.length} de {mockCellGroups.length} célula(s).</TableCaption>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleDownloadCellStatusCSV} variant="outline" size="sm" disabled={formattedCellGroups.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Baixar CSV Status das Células
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-2">
                <BarChartBig className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline text-xl">Relatório de Crescimento de Vidas</CardTitle>
            </div>
          <CardDescription className="font-body">Acompanhe o número de novas vidas ao longo do tempo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full max-w-xs">
            <Label htmlFor="growth-year-filter" className="font-body">Selecionar Ano</Label>
            <Select value={selectedGrowthYear} onValueChange={setSelectedGrowthYear} disabled={availableGrowthYears.length === 0}>
              <SelectTrigger id="growth-year-filter">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {availableGrowthYears.length > 0 ? availableGrowthYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                )) : <SelectItem value={getYear(new Date()).toString()} disabled>Nenhum dado</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          {mockVidas.length === 0 ? (
            <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">Nenhuma vida cadastrada.</div>
          ) : vidasGrowthChartData.every(d => d.count === 0) ? (
            <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">Nenhuma nova vida registrada para {selectedGrowthYear}.</div>
          ) : (
            <div className="h-[350px] w-full">
              <ChartContainer config={vidaGrowthChartConfig} className="h-full w-full">
                <BarChart accessibilityLayer data={vidasGrowthChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          )}
        </CardContent>
         <CardFooter>
            {totalVidasNoAno !== null ? (
                 <p className="text-sm text-muted-foreground font-body">
                    Total de Novas Vidas em {selectedGrowthYear}: <span className="font-semibold text-primary">{totalVidasNoAno}</span>.
                </p>
            ) : (
                <Skeleton className="h-5 w-48" />
            )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-2">
                <HandCoins className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline text-xl">Relatório Financeiro de Ofertas</CardTitle>
            </div>
          <CardDescription className="font-body">Visualize o total de ofertas por período.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <div>
              <Label htmlFor="offering-year-filter" className="font-body">Ano</Label>
              <Select value={selectedReportOfferingYear} onValueChange={setSelectedReportOfferingYear} disabled={availableReportOfferingYears.length === 0}>
                <SelectTrigger id="offering-year-filter">
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                    {availableReportOfferingYears.length > 0 ? availableReportOfferingYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                    )) : <SelectItem value={getYear(new Date()).toString()} disabled>Nenhum dado</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="offering-month-filter" className="font-body">Mês</Label>
              <Select value={selectedReportOfferingMonth} onValueChange={setSelectedReportOfferingMonth}>
                <SelectTrigger id="offering-month-filter">
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {reportMonths.map(month => (
                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-headline text-lg">Total Arrecadado no Período Filtrado</h3>
            {totalOfferingsForPeriodDisplay === null ? (
                <Skeleton className="h-8 w-32 mt-1" />
            ) : (
                <p className="text-2xl font-bold font-headline text-primary mt-1">{totalOfferingsForPeriodDisplay}</p>
            )}
            <p className="text-xs text-muted-foreground">
                {selectedReportOfferingMonth === "todos" ? `Ano de ${selectedReportOfferingYear}` : `${reportMonths.find(m=>m.value === selectedReportOfferingMonth)?.label} de ${selectedReportOfferingYear}`}
            </p>
          </div>

          {mockOfferings.length === 0 ? (
            <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">Nenhuma oferta registrada.</div>
          ) : reportOfferingChartData.every(d => d.totalAmount === 0) && filteredReportOfferings.length === 0 ? (
             <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                Nenhuma oferta registrada para {selectedReportOfferingMonth === "todos" ? `o ano de ${selectedReportOfferingYear}` : `${reportMonths.find(m=>m.value === selectedReportOfferingMonth)?.label} de ${selectedReportOfferingYear}`}.
            </div>
          ) : (
            <div className="h-[350px] w-full">
              <ChartContainer config={offeringChartConfig} className="h-full w-full">
                <BarChart accessibilityLayer data={reportOfferingChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8} 
                    tickFormatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0})}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                        formatter={(value, name, props) => {
                            return (
                                <div className="flex flex-col">
                                   <span className="text-muted-foreground">{props.payload.month}</span>
                                   <span className="font-bold">{Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                            )
                        }}
                    />}
                   />
                  <Legend />
                  <Bar dataKey="totalAmount" fill="var(--color-totalAmount)" radius={4} name="Total Arrecadado" />
                </BarChart>
              </ChartContainer>
            </div>
          )}
        </CardContent>
         <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div>
                 {totalOfertasNoAno !== null ? (
                    <p className="text-sm text-muted-foreground font-body">
                        Total Arrecadado no Ano de {selectedReportOfferingYear}: <span className="font-semibold text-primary">{totalOfertasNoAno}</span>.
                    </p>
                    ) : (
                    <Skeleton className="h-5 w-56" />
                )}
                <p className="text-xs text-muted-foreground font-body mt-1">
                Este relatório detalha as ofertas recebidas no período selecionado.
                </p>
            </div>
            <Button onClick={handleDownloadOfferingsCSV} variant="outline" size="sm" disabled={filteredReportOfferings.length === 0} className="mt-2 sm:mt-0">
                <Download className="mr-2 h-4 w-4" />
                Baixar CSV Detalhado de Ofertas
            </Button>
        </CardFooter>
      </Card>

    </div>
  );
}

