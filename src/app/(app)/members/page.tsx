import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold">Diretório de Membros</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Membro
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Lista de Membros</CardTitle>
          <CardDescription className="font-body">
            Mantenha um diretório de indivíduos incluindo nomes, datas de nascimento, informações de contato (WhatsApp) e afiliações a grupos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-body text-muted-foreground">
            Conteúdo da tabela de membros ou lista de cards irá aqui.
            Funcionalidades incluirão adicionar, editar, visualizar detalhes e filtrar membros.
            Cada membro exibirá nome, contato, data de nascimento e célula (se aplicável).
          </p>
          {/* Placeholder for table or list */}
          <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            Nenhum membro cadastrado ainda. Clique em "Adicionar Membro" para começar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
