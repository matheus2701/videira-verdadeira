import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { DatePickerWithRange } from "@/components/ui/date-picker-range"; // Placeholder for date picker

export default function ReportsPage() {
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
          <div className="flex items-center space-x-2">
            {/* <DatePickerWithRange /> Placeholder */}
            <p className="text-sm text-muted-foreground font-body">Seletor de Data (placeholder)</p>
            <Button variant="outline">Gerar Relatório</Button>
          </div>
          {/* Placeholder for chart */}
          <div className="h-[300px] mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
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
          <div className="flex items-center space-x-2">
            {/* <DatePickerWithRange /> Placeholder */}
            <p className="text-sm text-muted-foreground font-body">Seletor de Data (placeholder)</p>
            <select className="p-2 border rounded-md bg-background font-body">
              <option>Todas as Células</option>
              {/* Options for cells */}
            </select>
            <Button variant="outline">Gerar Relatório</Button>
          </div>
          {/* Placeholder for chart/table */}
          <div className="h-[300px] mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            Relatório de ofertas será exibido aqui.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
