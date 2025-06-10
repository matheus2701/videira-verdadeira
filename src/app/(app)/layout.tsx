'use client';

import { AppShell } from '@/components/layout/AppShell';
import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AppPagesLayout({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  // Estado para rastrear se a tentativa inicial de carregar o usuário (ex: do localStorage) foi concluída.
  const [authResolved, setAuthResolved] = useState(false);

  useEffect(() => {
    // O contexto AuthContext inicializa 'user' como null e depois tenta carregar do localStorage.
    // Quando 'user' no contexto é definido (seja para um objeto User ou permanece null),
    // consideramos a autenticação "resolvida".
    // A verificação 'auth.user !== undefined' não é ideal aqui porque o estado inicial do user no AuthContext é null, não undefined.
    // Em vez disso, podemos assumir que na primeira execução deste useEffect após a montagem,
    // o AuthContext já tentou sua inicialização.
    // Uma abordagem mais explícita seria o AuthContext fornecer um estado `isLoadingAuth`.
    // Por agora, vamos simplificar: se user é null (não logado) ou um objeto (logado), está resolvido.
    // O importante é que o AuthContext precisa de um ciclo para possivelmente preencher auth.user.
    
    // Este useEffect executa após a montagem e sempre que auth.user mudar.
    // Consideramos resolvido assim que o componente monta e o contexto está disponível.
    // O AuthContext em si já lida com o carregamento inicial do localStorage em seu próprio useEffect.
    setAuthResolved(true); 
  }, []); // Executa uma vez na montagem para indicar que podemos verificar o auth.user

  useEffect(() => {
    if (authResolved && !auth.user) {
      // Se a autenticação foi resolvida e não há usuário, redireciona para o login.
      router.push('/login');
    }
  }, [auth.user, authResolved, router]);

  if (!authResolved || !auth.user) {
    // Enquanto a autenticação não foi resolvida OU se o usuário não está logado (após resolução),
    // não renderiza nada (ou um loader). O useEffect acima cuidará do redirecionamento.
    // Isso evita renderizar AppShell brevemente se o usuário não estiver logado.
    return null; 
  }

  // Se a autenticação foi resolvida e há um usuário, renderiza o conteúdo protegido.
  return <AppShell>{children}</AppShell>;
}
