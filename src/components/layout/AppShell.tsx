
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { SidebarNavItems } from './SidebarNavItems';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';
import { mainNav, userNav } from '@/config/nav';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types';

interface AppShellLayoutProps {
  children: ReactNode;
}

function AppShellInner({ children }: AppShellLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, simulateLoginByRole, logout } = useAuth();

  const currentPage = mainNav.find(item => {
    if (item.exact) return item.href === pathname;
    return item.href !== '/dashboard' && pathname.startsWith(item.href);
  });

  const handleUserNavClick = (href: string) => {
    if (href === '#') { // Handle logout
      logout();
      router.push('/login'); // Redireciona para a página de login
    }
    // Se não for logout, a navegação normal via Link (asChild) cuidará disso.
  };
  
  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="border-r border-sidebar-border" collapsible="icon">
        <SidebarHeader className="p-4 border-b border-sidebar-border flex items-center justify-start group-data-[collapsible=icon]:justify-center">
          <Link href="/dashboard" className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
            <Icons.Logo className="h-7 w-7 text-primary" />
            <span className="group-data-[collapsible=icon]:hidden">
              Videira Verdadeira
            </span>
          </Link>
        </SidebarHeader>
        <ScrollArea className="flex-1">
          <SidebarContent className="p-2">
            <SidebarNavItems />
          </SidebarContent>
        </ScrollArea>
        <SidebarFooter className="p-2 border-t border-sidebar-border">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center p-2 h-auto">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar"/>
                    <AvatarFallback>{user.name?.substring(0,2).toUpperCase() || 'VV'}</AvatarFallback>
                  </Avatar>
                  <div className="ml-2 text-left group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56 mb-2">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userNav.map(item => {
                  const IconComponent = Icons[item.iconKey as keyof typeof Icons];
                  if (item.roles && user && !item.roles.includes(user.role)) {
                    return null;
                  }
                  return (
                    <DropdownMenuItem key={item.label} onClick={() => handleUserNavClick(item.href)} className="cursor-pointer p-0">
                      {item.href === '#' ? (
                         <button type="button" className="w-full text-left flex items-center relative px-2 py-1.5">
                           <IconComponent className="mr-2 h-4 w-4" />
                           <span>{item.label}</span>
                         </button>
                      ) : (
                        <Link href={item.href} className="flex items-center w-full px-2 py-1.5">
                          <IconComponent className="mr-2 h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <div>
              <h1 className="font-headline text-base sm:text-lg font-semibold text-foreground">
                {currentPage?.label || "Videira Verdadeira"}
              </h1>
            </div>
          </div>
          {/* Mock User Switcher for Demo */}
          <div className="flex gap-2 items-center">
            <span className="text-xs text-muted-foreground">Demo:</span>
            <Button size="sm" variant={user?.role === 'missionario' ? 'default' : 'outline'} onClick={() => simulateLoginByRole('missionario')}>Missionário</Button>
            <Button size="sm" variant={user?.role === 'lider_de_celula' ? 'default' : 'outline'} onClick={() => simulateLoginByRole('lider_de_celula')}>Líder Célula</Button>
          </div>
        </header>
        <main className="flex-1 p-6 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Wrap the AppShellInner with AuthProvider
export function AppShell({ children }: AppShellLayoutProps) {
  return (
    <AuthProvider>
      <AppShellInner>{children}</AppShellInner>
    </AuthProvider>
  )
}
