import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useSportCategories, useSportEntries, useSportStats } from '../../hooks';
import { SportsLayout } from '../layout';

import { SportActivitiesFilterBar } from './sport-activities-filter-bar';
import { SportCategoryHeader } from './sport-category-header';
import { SportCategorySummary } from './sport-category-summary';
import type { SportActivitiesFilters } from './types';
import { calculateSportCategorySummary } from './utils';

export const SportCategoryContent = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t } = useTranslation('sports');

  const [filters, setFilters] = useState<SportActivitiesFilters>({
    sort: 'date_desc',
  });

  const { data: categories = [], isLoading: isCategoriesLoading } = useSportCategories();
  const { data: stats, isLoading: isStatsLoading } = useSportStats(undefined);
  const { data: entriesData, isLoading: isEntriesLoading } = useSportEntries({
    categoryId,
    ...filters,
  });

  const categoryIndex = categories.findIndex((c) => c.id === categoryId);
  const currentCategory = categoryIndex !== -1 ? categories[categoryIndex] : null;
  const categoryStats = stats?.byCategory.find((c) => c.categoryId === categoryId);

  const items = useMemo(
    () => entriesData?.pages.flatMap((page) => page.items) ?? [],
    [entriesData],
  );

  const summary = useMemo(
    () => calculateSportCategorySummary(items, categoryStats),
    [items, categoryStats],
  );

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.startDate ||
    filters.endDate ||
    (filters.sort && filters.sort !== 'date_desc'),
  );

  const isInitialLoading = isCategoriesLoading || (isStatsLoading && isEntriesLoading);

  return (
    <div
      className="flex flex-col gap-3.5 pb-6 sm:gap-4"
      data-testid="sport-category-content"
    >
      <SportCategoryHeader
        category={currentCategory}
        categoryStats={categoryStats}
        colorIndex={categoryIndex !== -1 ? categoryIndex : 0}
        isLoading={isInitialLoading}
      />

      <SportCategorySummary
        summary={summary}
        isLoading={isEntriesLoading && items.length === 0}
      />

      {(summary.totalEntries > 0 || items.length > 0 || hasActiveFilters) && (
        <SportActivitiesFilterBar filters={filters} onFiltersChange={setFilters} />
      )}

      {items.length === 0 && !isEntriesLoading && (
        <div
          className="rounded-xl border border-border bg-card-bg p-6 text-center text-fg"
          data-testid="sport-category-empty-state"
        >
          <p className="text-sm text-text-muted">
            {hasActiveFilters ? t('entries.emptyFiltered') : t('entries.empty')}
          </p>
        </div>
      )}
    </div>
  );
};

export const SportCategoryPage = () => {
  return (
    <SportsLayout>
      <SportCategoryContent />
    </SportsLayout>
  );
};
