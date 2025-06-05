import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function OfferingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold">Rastrear Ofertas</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Registrar Oferta
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Registro de Ofertas</CardTitle>
          <CardDescription className="font-body">
            Registre ofertas específicas de células com valor, data e notas; gere relatórios por data, célula ou totais gerais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-body text-muted-foreground">
            Conteúdo da tabela de ofertas ou formulário de registro irá aqui.
            Funcionalidades incluirão registrar novas ofertas, visualizar histórico, filtrar por data/célula e gerar relatórios simples.
          </p>
          {/* Placeholder for table or list */}
          <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            Nenhuma oferta registrada ainda. Clique em "Registrar Oferta" para começar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
