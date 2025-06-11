
'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Network, ShieldAlert } from 'lucide-react'; // Adicionado ShieldAlert
import { Skeleton } from '@/components/ui/skeleton';

export default function GeracaoVideiraPage() {
  const { mockUsers, user: currentUser } = useAuth(); // Pegar o usuário logado também

  // Encontra o usuário missionário que é o "Admin Missionário"
  // Vamos assumir que o e-mail dele é único para identificação.
  // Ou podemos simplesmente pegar o primeiro missionário da lista,
  // ou o usuário logado se ele for o missionário.
  let responsavel = mockUsers.find(u => u.email === 'matheus.santos01@gmail.com' && u.role === 'missionario');
  
  // Se não encontrar pelo email específico, e o usuário logado for missionário, assume-se que ele é o responsável.
  if (!responsavel && currentUser?.role === 'missionario') {
    responsavel = currentUser;
  } else if (!responsavel) {
    // Fallback: pega o primeiro missionário da lista se nenhum dos acima for encontrado.
    responsavel = mockUsers.find(u => u.role === 'missionario');
  }


  if (!responsavel) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Network className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-3xl font-semibold">Geração Videira Verdadeira</h1>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-destructive" />
              Informação Indisponível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-muted-foreground">
              Não foi possível determinar o missionário responsável pela Geração Videira Verdadeira no momento.
              Por favor, verifique as configurações de usuários no sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const nomeResponsavel = responsavel.name;
  const cargoResponsavel = "Missionário"; // Definido como Missionário

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Network className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-3xl font-semibold">Geração Videira Verdadeira</h1>
      </div>

      <Card className="shadow-lg max-w-md">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="https://placehold.co/100x100.png" alt={`Foto de ${nomeResponsavel}`} data-ai-hint="person portrait" />
            <AvatarFallback>
              {nomeResponsavel ? nomeResponsavel.substring(0, 2).toUpperCase() : 'VV'}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="font-headline text-2xl">
            {nomeResponsavel || <Skeleton className="h-8 w-48" />}
          </CardTitle>
          <CardDescription className="font-body text-md">
            {cargoResponsavel} Responsável
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          <div className="border-t pt-4">
            <h3 className="font-headline text-lg mb-2">Detalhes do Responsável</h3>
            <div className="space-y-2 font-body text-sm">
              <p>
                <strong className="font-medium">Nome:</strong> {nomeResponsavel || <Skeleton className="h-5 w-40 inline-block" />}
              </p>
              <p>
                <strong className="font-medium">Cargo:</strong> {cargoResponsavel}
              </p>
              <p>
                <strong className="font-medium">E-mail:</strong> {responsavel.email || <Skeleton className="h-5 w-52 inline-block" />}
              </p>
            </div>
          </div>
          <div className="border-t pt-4">
             <h3 className="font-headline text-lg mb-2">Sobre a Geração Videira Verdadeira</h3>
             <p className="font-body text-muted-foreground text-sm">
                A Geração Videira Verdadeira representa o compromisso com a formação de discípulos
                segundo os ensinamentos de Cristo, cultivando líderes e membros que frutificam
                em amor, serviço e fé. Sob a liderança e visão missionária, buscamos expandir
                o Reino de Deus, célula por célula, vida por vida.
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
