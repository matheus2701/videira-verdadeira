import { AppShell } from '@/components/layout/AppShell';
import type { ReactNode } from 'react';

export default function AppPagesLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
