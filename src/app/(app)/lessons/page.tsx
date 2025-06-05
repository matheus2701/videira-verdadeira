
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

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
          <div className="mt-8 p-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground space-y-4">
            <BookOpen className="w-16 h-16 text-primary/70" />
            <p className="text-lg font-medium font-headline">Acompanhamento Detalhado em Breve!</p>
            <p className="font-body text-sm max-w-md">
              Esta seção permitirá que você visualize o progresso de cada Casa de Paz através das 8 lições fundamentais.
              Poderá ver quais lições foram concluídas e ter uma visão clara do desenvolvimento espiritual dos participantes.
            </p>
            <p className="font-body text-xs">
              Por enquanto, continue gerenciando suas Casas de Paz na seção dedicada.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
