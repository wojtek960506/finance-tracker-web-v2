import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';

import { useSportCategories, useSportStats } from '../../hooks';

import { SportsHeader } from './sports-header';
import { SportsTabs } from './sports-tabs';
import type { SportsLayoutProps } from './types';

export const SportsLayout = ({ children, onOpenAddEntry }: SportsLayoutProps) => {
  const location = useLocation();
  const { categoryId: currentCategoryId } = useParams<{ categoryId?: string }>();
  const { data: categories = [], isLoading: isCategoriesLoading } = useSportCategories();
  const { data: allTimeStats, isLoading: isStatsLoading } = useSportStats(undefined);

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setIsMobileNavOpen(false);
  }

  const visibleCategories = useMemo(() => {
    if (!allTimeStats) {
      return isStatsLoading ? [] : categories;
    }

    const activeCategoryIds = new Set(
      allTimeStats.byCategory
        .filter((cat) => cat.entryCount > 0)
        .map((cat) => cat.categoryId),
    );

    return categories.filter(
      (cat) => activeCategoryIds.has(cat.id) || cat.id === currentCategoryId,
    );
  }, [allTimeStats, categories, currentCategoryId, isStatsLoading]);

  const hasRecords = Boolean(allTimeStats && allTimeStats.totalEntries > 0);

  return (
    <div
      className={clsx(
        'mx-auto flex h-full min-h-0 w-full max-w-[120rem]',
        'flex-col gap-3.5 overflow-hidden p-2 sm:p-4 sm:gap-4',
      )}
      data-testid="sports-layout"
    >
      <SportsHeader
        hasNavigation={hasRecords}
        isMobileNavOpen={isMobileNavOpen}
        onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
        onOpenAddEntry={hasRecords ? onOpenAddEntry : undefined}
      />

      {hasRecords && (
        <SportsTabs
          categories={visibleCategories}
          isLoading={isCategoriesLoading || isStatsLoading}
          isMobileNavOpen={isMobileNavOpen}
          onCloseMobileNav={() => setIsMobileNavOpen(false)}
        />
      )}

      <div className="min-h-0 flex-1 overflow-y-auto pt-1">{children ?? <Outlet />}</div>
    </div>
  );
};
