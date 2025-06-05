import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function PeaceHousesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold">Coordenação de Casas de Paz</h1>
         <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Agendar Casa de Paz
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Agendamento e Acompanhamento</CardTitle>
          <CardDescription className="font-body">
            Coordene reuniões de Casas de Paz registrando participantes, grupo de célula responsável, data agendada e equipes designadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-body text-muted-foreground">
            Interface para agendar novas Casas de Paz, listar as existentes, registrar participantes,
            atribuir responsáveis e equipes, e acompanhar o progresso das lições.
          </p>
          {/* Placeholder for table or list */}
          <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            Nenhuma Casa de Paz agendada. Clique em "Agendar Casa de Paz" para começar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
