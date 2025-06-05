'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mainNav, type NavItem } from '@/config/nav';
import { Icons } from '@/components/icons';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function SidebarNavItems() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {mainNav.map((item) => {
        const IconComponent = Icons[item.iconKey];
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        return (
          <SidebarMenuItem key={item.label}>
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
