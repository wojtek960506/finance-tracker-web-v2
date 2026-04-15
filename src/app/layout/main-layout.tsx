import { type ReactNode, useRef } from 'react';

import { Navigation } from '@app/navigation';
import { NavigationProvider } from '@context/navigation-context';
import { useUIStore } from '@store/ui-store';
import { Drawer, Toaster } from '@ui';

import { Topbar } from './topbar';

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const { isNavOpen, setIsNavOpen } = useUIStore();
  const isDrawerFromLeft = true;
  const navButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="h-screen overflow-x-auto overflow-y-hidden">
      <div className="flex h-full min-w-85 flex-col">
        <Topbar navButtonRef={navButtonRef} />

        <main className="p-4 h-full w-full overflow-y-auto">
          {/* p-1 == p-[0.25rem] == p-[4px] */}
          {children}
        </main>

        <Drawer
          isOpen={isNavOpen}
          fromLeft={isDrawerFromLeft}
          onClose={() => setIsNavOpen(false)}
          restoreFocusRef={navButtonRef}
          ariaLabel="Navigation menu"
        >
          <NavigationProvider fromLeft={isDrawerFromLeft}>
            <Navigation />
          </NavigationProvider>
        </Drawer>
        <Toaster />
      </div>
    </div>
  );
};
