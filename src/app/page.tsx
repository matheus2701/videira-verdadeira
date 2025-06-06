
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icons.Logo className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-2xl font-semibold text-foreground">
            Videira Verdadeira
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard">Acessar Sistema</Link>
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <section className="py-20">
          <div className="container mx-auto">
            <Icons.Logo className="h-24 w-24 text-primary mx-auto mb-6" />
            <h2 className="font-headline text-5xl font-bold text-foreground mb-6">
              Bem-vindo à Videira Verdadeira
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Gerencie seus grupos de células, membros, ofertas e casas de paz com facilidade e espiritualidade.
            </p>
            <Button asChild size="lg">
              <Link href="/dashboard">
                Começar Agora
              </Link>
            </Button>
          </div>
        </section>
        
        <section className="py-16 bg-secondary w-full">
          <div className="container mx-auto grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-card rounded-lg shadow-md">
              <Icons.CellGroups className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-headline text-2xl font-semibold text-foreground mb-2">Grupos de Células</h3>
              <p className="text-muted-foreground">Organize e acompanhe os detalhes de cada célula.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-md">
              <Icons.Vidas className="h-10 w-10 text-primary mb-4" /> 
              <h3 className="font-headline text-2xl font-semibold text-foreground mb-2">Vidas</h3>
              <p className="text-muted-foreground">Mantenha um diretório completo das vidas do Senhor Jesus.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-md">
              <Icons.PeaceHouses className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-headline text-2xl font-semibold text-foreground mb-2">Casas de Paz</h3>
              <p className="text-muted-foreground">Coordene encontros e acompanhe o progresso.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-8 text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Videira Verdadeira. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
