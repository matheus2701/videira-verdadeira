
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BookOpen, UserCheck, TrendingUp } from "lucide-react"; // Adicionado TrendingUp
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

// Dados mock locais com os títulos atualizados
const initialPeaceChildrenProgress: PeaceChildProgress[] = [
  {
    id: "pcp1",
    name: "Família Silva (Casa da Paz)",
    cellGroupName: "Discípulos de Cristo",
    lessons: [
      { id: "l1", title: "Quando Jesus entra em minha casa a verdadeira paz é estabelecida", completed: true },
      { id: "l2", title: "Quando Jesus entra em minha casa decisões corretas são tomadas", completed: true },
      { id: "l3", title: "Quando Jesus entra em minha casa o perdão é liberado", completed: false },
      { id: "l4", title: "Quando Jesus entra em minha casa ressurreições acontecem", completed: false },
      { id: "l5", title: "Quando Jesus entra em minha casa pessoas são curadas", completed: false },
      { id: "l6", title: "Quando Jesus entra em minha casa limitações são vencidas", completed: false },
      { id: "l7", title: "Quando Jesus entra em minha casa pessoas são salvas", completed: false },
      { id: "l8", title: "Meu coração a principal casa a ser conquistada", completed: false },
    ],
  },
  {
    id: "pcp2",
    name: "João e Maria (Visitantes)",
    cellGroupName: "Leões de Judá",
    lessons: [
      { id: "l1", title: "Quando Jesus entra em minha casa a verdadeira paz é estabelecida", completed: true },
      { id: "l2", title: "Quando Jesus entra em minha casa decisões corretas são tomadas", completed: true },
      { id: "l3", title: "Quando Jesus entra em minha casa o perdão é liberado", completed: true },
      { id: "l4", title: "Quando Jesus entra em minha casa ressurreições acontecem", completed: true },
      { id: "l5", title: "Quando Jesus entra em minha casa pessoas são curadas", completed: true },
      { id: "l6", title: "Quando Jesus entra em minha casa limitações são vencidas", completed: false },
      { id: "l7", title: "Quando Jesus entra em minha casa pessoas são salvas", completed: false },
      { id: "l8", title: "Meu coração a principal casa a ser conquistada", completed: false },
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
    if (!lessons || lessons.length === 0) return 0;
    const completedCount = lessons.filter(l => l.completed).length;
    return Math.round((completedCount / lessons.length) * 100);
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline text-3xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary"/>Progresso das Lições (Casas de Paz)
        </h1>
        {/* Futuramente: Botão para adicionar nova Casa de Paz/Filho da Paz para acompanhamento */}
      </div>

      {progressData.length === 0 ? (
        <Card className="shadow-md">
           <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary"/> Nenhuma Casa de Paz em Acompanhamento</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center p-8">
                <BookOpen className="w-16 h-16 text-primary/50 mb-4" />
                <p className="text-muted-foreground font-body">Comece adicionando uma nova Casa de Paz para registrar o progresso das lições.</p>
                {/* <Button className="mt-4">Adicionar Casa de Paz (Em breve)</Button> */}
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progressData.map(pc => (
            <Card key={pc.id} className="shadow-lg flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-xl flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-primary"/> {pc.name}
                        </CardTitle>
                        <CardDescription className="font-body text-sm mt-1">
                            Célula Responsável: {pc.cellGroupName}
                        </CardDescription>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-semibold text-primary bg-primary/10 px-2.5 py-1.5 rounded-full">
                            {calculateProgressPercentage(pc.lessons)}%
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">Concluído</p>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 flex-grow">
                <h4 className="font-medium font-body text-md mb-2">Lições Fundamentais:</h4>
                <ul className="space-y-2.5">
                  {pc.lessons.map(lesson => (
                    <li key={lesson.id} className="flex items-center space-x-3 p-2.5 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20">
                      <Checkbox
                        id={`${pc.id}-${lesson.id}`}
                        checked={lesson.completed}
                        onCheckedChange={() => handleLessonToggle(pc.id, lesson.id)}
                        aria-label={`Marcar lição ${lesson.title} como ${lesson.completed ? 'não concluída' : 'concluída'}`}
                        className="h-5 w-5"
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
       <Card className="mt-8 bg-card shadow-md">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary"/> Entendendo o Acompanhamento das Lições</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="font-body text-muted-foreground mb-4">
                Esta seção é projetada para monitorar o avanço dos participantes das Casas de Paz através das 8 lições fundamentais.
                Marque cada lição como concluída à medida que o grupo progride. O progresso é salvo individualmente para cada Casa de Paz ou grupo de visitantes.
                </p>
                <div className="mt-4 p-4 border border-dashed rounded-lg text-sm text-muted-foreground font-body bg-background/50">
                    <strong>Próximos Passos / Funcionalidades Futuras:</strong>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1.5">
                        <li>Permitir adicionar novas "Casas de Paz" ou "Filhos da Paz" diretamente nesta tela para acompanhamento.</li>
                        <li>Integrar esta lista com um cadastro central de Casas de Paz (atualmente os dados são mock locais).</li>
                        <li>Persistir o progresso das lições de forma real (ex: usando Firebase Firestore).</li>
                        <li>Gerar relatórios sobre o progresso geral das lições em todas as Casas de Paz.</li>
                        <li>Notificações para líderes sobre o status das lições.</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
      
