import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LessonsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-semibold">Progresso das Lições (Casas de Paz)</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Acompanhamento das 8 Lições</CardTitle>
          <CardDescription className="font-body">
            Monitore o progresso através das 8 lições das Casas de Paz para cada grupo/participante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-body text-muted-foreground">
            Visualização do progresso das lições. Isso pode ser uma tabela mostrando cada Casa de Paz ativa
            e o status de conclusão de cada uma das 8 lições (Ex: checkboxes ou barras de progresso).
          </p>
          {/* Placeholder for progress tracking UI */}
          <div className="mt-4 p-8 border border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            Nenhum progresso de lição para exibir. Acompanhe o progresso a partir da página de "Casas de Paz".
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
