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
      <div className="flex h-full min-w-[340px] flex-col">
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
          // Keep the nav drawer horizontally scrollable below its intended content width
          panelClassName="overflow-x-auto sm:w-[min(22rem,100vh)]"
          // Navigation becomes hard to use below some width
          contentClassName="min-w-[20rem] sm:min-w-[22rem]"
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
