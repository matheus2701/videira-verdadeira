import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function CellGroupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold">Gerenciar Grupos de Células</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Grupo
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Lista de Grupos de Células</CardTitle>
          <CardDescription className="font-body">
            Interface intuitiva para gerenciar detalhes dos grupos de células, incluindo nome, endereço, dia/horário de reunião e atualizações semanais de status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-body text-muted-foreground">
            Conteúdo da tabela de grupos de células ou lista de cards irá aqui.
            Funcionalidades incluirão adicionar, editar, visualizar e arquivar grupos.
            Cada grupo exibirá seu nome, líder, local, dia/hora e status atual.
          </p>
          {/* Placeholder for table or list */}
          <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            Nenhum grupo de célula cadastrado ainda. Clique em "Adicionar Grupo" para começar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
