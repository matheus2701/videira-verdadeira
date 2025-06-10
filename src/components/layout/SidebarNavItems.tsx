
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mainNav, type NavItemConfig } from '@/config/nav';
import { Icons } from '@/components/icons';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export function SidebarNavItems() {
  const pathname = usePathname();
  const { user, appPermissions } = useAuth(); // Adicionado appPermissions

  if (!user) {
    return null; 
  }

  return (
    <SidebarMenu>
      {mainNav.map((item) => {
        let isVisibleBasedOnRole = false;

        if (item.href === '/reports') {
          // Lógica específica para o item "Relatórios"
          if (user.role === 'missionario') {
            isVisibleBasedOnRole = true;
          } else if (user.role === 'lider_de_celula' && appPermissions.liderPodeVerRelatorios) {
            isVisibleBasedOnRole = true;
          }
        } else {
          // Lógica padrão para outros itens de navegação
          if (item.roles && item.roles.includes(user.role)) {
            isVisibleBasedOnRole = true;
          }
        }

        if (!isVisibleBasedOnRole) {
          return null;
        }

        const IconComponent = Icons[item.iconKey as keyof typeof Icons];
        let isActive: boolean;
        if (item.exact) {
            isActive = pathname === item.href;
        } else {
            isActive = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
        }
        
        if (item.label === "Minha Célula" && user.role === 'lider_de_celula') {
             isActive = pathname === item.href || pathname.startsWith('/cell-groups/my-cell');
             if (pathname === '/cell-groups' && item.href.startsWith('/cell-groups/my-cell')) {
                isActive = false; 
             }
        } else if (item.label === "Grupos de Células" && user.role === 'missionario') {
            isActive = pathname === item.href || (pathname.startsWith('/cell-groups') && !pathname.startsWith('/cell-groups/my-cell'));
        }


        return (
          <SidebarMenuItem key={item.label + item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={{ content: item.label, side: 'right', align: 'center' }}
              className={cn(
                "justify-start",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
              )}
              aria-disabled={item.disabled}
              disabled={item.disabled}
            >
              <Link href={item.disabled ? "#" : item.href}>
                <IconComponent className="h-5 w-5 shrink-0 text-primary group-data-[active=true]:text-sidebar-primary-foreground" />
                <span className="truncate">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

    