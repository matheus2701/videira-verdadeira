
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BookOpen, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Tipos locais para esta página
interface Lesson {
  id: string;
  title: string;
  completed: boolean;
}

interface PeaceChildProgress {
  id: string;
  name: string; // Nome do Filho da Paz ou identificador da Casa de Paz
  cellGroupName: string; // Célula responsável
  lessons: Lesson[];
}

// Dados mock locais
const initialPeaceChildrenProgress: PeaceChildProgress[] = [
  {
    id: "pcp1",
    name: "Família Silva (Casa da Paz)",
    cellGroupName: "Discípulos de Cristo",
    lessons: [
      { id: "l1", title: "Lição 1: O Amor de Deus", completed: true },
      { id: "l2", title: "Lição 2: O Pecado e suas Consequências", completed: true },
      { id: "l3", title: "Lição 3: Jesus, a Única Solução", completed: false },
      { id: "l4", title: "Lição 4: Fé e Arrependimento", completed: false },
      { id: "l5", title: "Lição 5: O Novo Nascimento", completed: false },
      { id: "l6", title: "Lição 6: O Batismo nas Águas", completed: false },
      { id: "l7", title: "Lição 7: Vida no Espírito", completed: false },
      { id: "l8", title: "Lição 8: A Igreja, Corpo de Cristo", completed: false },
    ],
  },
  {
    id: "pcp2",
    name: "João e Maria (Visitantes)",
    cellGroupName: "Leões de Judá",
    lessons: [
      { id: "l1", title: "Lição 1: O Amor de Deus", completed: true },
      { id: "l2", title: "Lição 2: O Pecado e suas Consequências", completed: false },
      { id: "l3", title: "Lição 3: Jesus, a Única Solução", completed: false },
      { id: "l4", title: "Lição 4: Fé e Arrependimento", completed: false },
      { id: "l5", title: "Lição 5: O Novo Nascimento", completed: false },
      { id: "l6", title: "Lição 6: O Batismo nas Águas", completed: false },
      { id: "l7", title: "Lição 7: Vida no Espírito", completed: false },
      { id: "l8", title: "Lição 8: A Igreja, Corpo de Cristo", completed: false },
    ],
  },
];


export default function LessonsPage() {
  const [progressData, setProgressData] = useState<PeaceChildProgress[]>(initialPeaceChildrenProgress);
  const { toast } = useToast();

  const handleLessonToggle = (peaceChildId: string, lessonId: string) => {
    setProgressData(prevData =>
      prevData.map(pc =>
        pc.id === peaceChildId
          ? {
              ...pc,
              lessons: pc.lessons.map(lesson =>
                lesson.id === lessonId
                  ? { ...lesson, completed: !lesson.completed }
                  : lesson
              ),
            }
          : pc
      )
    );
  };

  const handleSaveChanges = (peaceChildName: string) => {
    // Em uma aplicação real, aqui você faria a chamada para salvar os dados
    console.log("Progresso salvo para:", peaceChildName, progressData.find(p=>p.name === peaceChildName));
    toast({
      title: "Progresso Salvo (Simulado)",
      description: `As alterações para ${peaceChildName} foram registradas no console.`,
    });
  };
  
  const calculateProgressPercentage = (lessons: Lesson[]): number => {
    const completedCount = lessons.filter(l => l.completed).length;
    return Math.round((completedCount / lessons.length) * 100);
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold">Progresso das Lições (Casas de Paz)</h1>
        {/* Futuramente: Botão para adicionar nova Casa de Paz/Filho da Paz para acompanhamento */}
      </div>

      {progressData.length === 0 ? (
        <Card>
           <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary"/> Nenhuma Casa de Paz em Acompanhamento</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground font-body">Comece adicionando uma nova Casa de Paz para registrar o progresso das lições.</p>
                {/* <Button className="mt-4">Adicionar Casa de Paz (Em breve)</Button> */}
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progressData.map(pc => (
            <Card key={pc.id} className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-xl flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-primary"/> {pc.name}
                        </CardTitle>
                        <CardDescription className="font-body text-sm">
                            Célula Responsável: {pc.cellGroupName}
                        </CardDescription>
                    </div>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {calculateProgressPercentage(pc.lessons)}%
                    </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <h4 className="font-medium font-body text-md mb-2">Lições:</h4>
                <ul className="space-y-2.5">
                  {pc.lessons.map(lesson => (
                    <li key={lesson.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={`${pc.id}-${lesson.id}`}
                        checked={lesson.completed}
                        onCheckedChange={() => handleLessonToggle(pc.id, lesson.id)}
                        aria-label={`Marcar lição ${lesson.title} como ${lesson.completed ? 'não concluída' : 'concluída'}`}
                      />
                      <Label
                        htmlFor={`${pc.id}-${lesson.id}`}
                        className={`flex-1 cursor-pointer font-body text-sm ${lesson.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                      >
                        {lesson.title}
                      </Label>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSaveChanges(pc.name)} size="sm" className="w-full font-body">
                  Salvar Progresso (Simulado)
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
       <Card className="mt-8">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary"/> Acompanhamento das 8 Lições</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="font-body text-muted-foreground">
                Monitore o progresso através das 8 lições das Casas de Paz para cada grupo/participante.
                Marque as lições concluídas e salve o progresso.
                </p>
                <div className="mt-4 p-6 border border-dashed rounded-lg text-sm text-muted-foreground font-body">
                    <strong>Funcionalidades Futuras:</strong>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li>Adicionar novas Casas de Paz/Filhos da Paz para acompanhamento.</li>
                        <li>Integrar com a lista real de Casas de Paz cadastradas.</li>
                        <li>Persistir o progresso das lições (ex: Firebase).</li>
                        <li>Relatórios de progresso mais detalhados.</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
      