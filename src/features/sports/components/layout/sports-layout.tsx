import clsx from 'clsx';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useSportCategories } from '../../hooks';

import { SportsHeader } from './sports-header';
import { SportsTabs } from './sports-tabs';
import type { SportsLayoutProps } from './types';

export const SportsLayout = ({ children }: SportsLayoutProps) => {
  const location = useLocation();
  const { data: categories = [], isLoading } = useSportCategories();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setIsMobileNavOpen(false);
  }

  return (
    <div
      className={clsx(
        'mx-auto flex h-full min-h-0 w-full max-w-[120rem]',
        'flex-col gap-3.5 overflow-hidden p-2 sm:p-4 sm:gap-4',
      )}
      data-testid="sports-layout"
    >
      <SportsHeader
        isMobileNavOpen={isMobileNavOpen}
        onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
      />

      <SportsTabs
        categories={categories}
        isLoading={isLoading}
        isMobileNavOpen={isMobileNavOpen}
        onCloseMobileNav={() => setIsMobileNavOpen(false)}
      />

      <div className="min-h-0 flex-1 overflow-y-auto pt-1">{children ?? <Outlet />}</div>
    </div>
  );
};
