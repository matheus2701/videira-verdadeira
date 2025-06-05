import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-range"; // Assuming this component will be created
import { BarChartBig, Users, HandCoins, ShieldCheck, TrendingUp } from "lucide-react";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts'; // For chart
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Placeholder data for the chart
const memberData = [
  { date: "Jan", totalMembers: 65 },
  { date: "Feb", totalMembers: 59 },
  { date: "Mar", totalMembers: 80 },
  { date: "Apr", totalMembers: 81 },
  { date: "Mai", totalMembers: 56 },
  { date: "Jun", totalMembers: 55 },
  { date: "Jul", totalMembers: 40 },
];

const chartConfig = {
  totalMembers: {
    label: "Total de Membros",
    color: "hsl(var(--primary))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-body">Total de Membros</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">1,234</div>
            <p className="text-xs text-muted-foreground">+5.2% desde o mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-body">Células Ativas</CardTitle>
            <BarChartBig className="h-5 w-5 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">58</div>
            <p className="text-xs text-muted-foreground">+2 novas esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-body">Ofertas (Mês)</CardTitle>
            <HandCoins className="h-5 w-5 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">R$ 3,450.00</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-body">Casas de Paz Ativas</CardTitle>
            <ShieldCheck className="h-5 w-5 text-muted-foreground text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">12</div>
            <p className="text-xs text-muted-foreground">3 novas programadas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Crescimento de Membros</CardTitle>
          <CardDescription className="font-body">Visualize o total de membros registrados ao longo do tempo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
             {/* DatePickerWithRange would go here, placeholder for now */}
             <p className="text-sm text-muted-foreground font-body">Seletor de data (placeholder)</p>
            <Button variant="outline" size="sm">Atualizar</Button>
          </div>
          <div className="h-[350px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart accessibilityLayer data={memberData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="totalMembers" fill="var(--color-totalMembers)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
