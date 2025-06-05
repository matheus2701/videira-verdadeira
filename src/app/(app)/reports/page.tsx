
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert, CalendarIcon } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-picker-range";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReportsPage() {
  const { user } = useAuth();

  if (user?.role === 'lider_de_celula') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="font-headline text-3xl font-semibold mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground text-center">
          Líderes de Célula não têm acesso à seção de relatórios gerais.
          <br />
          Relatórios específicos da sua célula podem estar disponíveis em outras seções.
        </p>
      </div>
    );
  }
  
  if (user?.role !== 'missionario') {
     return (
      <div className="flex flex-col items-center justify-center h-full">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="font-headline text-3xl font-semibold mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-semibold">Relatórios Visuais</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Relatório de Crescimento de Membros</CardTitle>
          <CardDescription className="font-body">
            Gere relatórios visuais mostrando o total de membros registrados em um intervalo de tempo para rastrear o crescimento e visualizar o impacto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <DatePickerWithRange />
            <Button variant="outline" className="font-body">Gerar Relatório</Button>
          </div>
          {/* Placeholder for chart */}
          <div className="h-[300px] mt-4 p-8 border border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground">
             <BarChartBig className="w-12 h-12 mb-2 text-primary/70" />
            Gráfico de crescimento de membros será exibido aqui.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Relatório de Ofertas</CardTitle>
          <CardDescription className="font-body">
            Visualize totais de ofertas por período, célula ou geral.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <DatePickerWithRange />
            <Select defaultValue="todas">
              <SelectTrigger className="w-auto min-w-[200px] font-body">
                <SelectValue placeholder="Filtrar por Célula" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Células</SelectItem>
                <SelectItem value="celula_a">Célula Discípulos (Exemplo)</SelectItem>
                <SelectItem value="celula_b">Célula Leões de Judá (Exemplo)</SelectItem>
                {/* Mais opções de células seriam carregadas dinamicamente */}
              </SelectContent>
            </Select>
            <Button variant="outline" className="font-body">Gerar Relatório</Button>
          </div>
          {/* Placeholder for chart/table */}
          <div className="h-[300px] mt-4 p-8 border border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground">
            <HandCoins className="w-12 h-12 mb-2 text-primary/70" />
            Relatório de ofertas será exibido aqui.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
