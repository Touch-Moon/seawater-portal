'use client';

import { ThemeProvider } from 'next-themes';
import { SidePanelProvider, useSidePanel } from '@/context/SidePanelContext';
import SidePanel from '@/components/shared/SidePanel';

function SidePanelRoot() {
  const { open, closePanel } = useSidePanel();
  return <SidePanel open={open} onClose={closePanel} />;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={true}>
      <SidePanelProvider>
        {children}
        <SidePanelRoot />
      </SidePanelProvider>
    </ThemeProvider>
  );
}
