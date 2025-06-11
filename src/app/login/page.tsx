
'use client';

import { useEffect, useState } from 'react'; // Adicionado useState
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' }), // Supabase geralmente exige 6+
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado local para submissão

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    // Redireciona para o dashboard se o usuário já estiver logado
    // Isso será acionado pelo onAuthStateChange no AuthContext populando auth.user
    if (auth.user) {
      router.push('/dashboard');
    }
  }, [auth.user, router]);

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    const success = await auth.loginWithEmail(values.email, values.password);
    if (success) {
      // O useEffect acima cuidará do redirecionamento quando auth.user for atualizado
      // Não é necessário redirecionar explicitamente aqui se onAuthStateChange for rápido.
      // Mas, para garantir, podemos manter ou adicionar um pequeno delay para o contexto atualizar.
      // router.push('/dashboard'); // Pode ser redundante se onAuthStateChange for rápido
    } else {
      toast({
        title: 'Erro de Login',
        description: 'E-mail ou senha inválidos. Verifique suas credenciais ou contate o suporte.',
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  }

  // Se o usuário se tornar disponível enquanto nesta página (devido à atualização rápida do contexto),
  // o useEffect cuidará do redirecionamento. Renderiza nada ou um loader até lá.
   if (auth.user && !isSubmitting) {
    return null; 
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Icons.Logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Bem-vindo de Volta!</CardTitle>
          <CardDescription className="font-body">
            Acesse sua conta para continuar gerenciando a Videira Verdadeira.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">E-mail</Label>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">Senha</Label>
                    <FormControl>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="********" 
                        autoComplete="current-password"
                        {...field} 
                       />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
