import { useQuery } from '@tanstack/react-query';
import { type ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Navigation } from '@app/navigation';
import { NavigationProvider } from '@context/navigation-context';
import { useUIStore } from '@store/ui-store';
import { Drawer, Toaster } from '@ui';

import { BrandLink } from './topbar/brand-link';
import { LanguageSwitcher } from './topbar/language-switcher';
import { ThemeButton } from './topbar/theme-button';
import { Topbar } from './topbar';

import { getMe } from '@/features/auth/api';
import { useAuthToken } from '@/shared/hooks';

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation('navigation');
  const { isNavOpen, setIsNavOpen } = useUIStore();
  const isDrawerFromLeft = true;
  const navButtonRef = useRef<HTMLButtonElement>(null);

  const { isAuthenticated, isAuthResolved } = useAuthToken();
  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: isAuthResolved && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <div className="h-[100dvh] overflow-x-auto overflow-hidden">
      <div className="flex h-full min-w-[340px] min-h-0 flex-col">
        <Topbar navButtonRef={navButtonRef} />

        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>

        <Drawer
          isOpen={isNavOpen}
          fromLeft={isDrawerFromLeft}
          onClose={() => setIsNavOpen(false)}
          headerLeft={
            <div className="flex items-center md:hidden">
              <BrandLink logoClassName="h-8" />
              <LanguageSwitcher dropdownAlign="left" />
              <ThemeButton />
            </div>
          }
          restoreFocusRef={navButtonRef}
          ariaLabel="Navigation menu"
          // Keep the nav drawer horizontally scrollable below its intended content width
          panelClassName="overflow-x-auto sm:w-[min(22rem,100vh)]"
          // Navigation becomes hard to use below some width
          contentClassName="min-w-[20rem] sm:min-w-[22rem]"
        >
          {data && (
            <p className="font-semibold sm:font-bold text-lgbase sm:text-xl p-1 sm:p-2 break-words">
              {t('hi')}, {data.firstName} {data.lastName}
            </p>
          )}
          <NavigationProvider fromLeft={isDrawerFromLeft}>
            <Navigation />
          </NavigationProvider>
        </Drawer>
        <Toaster />
      </div>
    </div>
  );
};
