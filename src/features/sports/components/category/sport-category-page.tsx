import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PageLoading } from '@shared/ui';

import type { SportEntry } from '../../api';
import {
  useSportCategories,
  useSportEntries,
  useSportRecordModals,
  useSportStats,
} from '../../hooks';
import { CreateSportActivityModal } from '../activity-modals';
import { SportsLayout } from '../layout';

import { SportActivitiesTable } from './activities-table';
import { SportActivitiesFilterBar } from './sport-activities-filter-bar';
import { SportCategoryHeader } from './sport-category-header';
import { SportCategorySummary } from './sport-category-summary';
import type { SportActivitiesFilters } from './types';
import { calculateSportCategorySummary } from './utils';

export interface SportCategoryContentProps {
  onAddActivity?: () => void;
}

export const SportCategoryContent = ({
  onAddActivity,
}: SportCategoryContentProps = {}) => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const [filters, setFilters] = useState<SportActivitiesFilters>({
    sort: 'date_desc',
  });

  const { data: categories = [], isLoading: isCategoriesLoading } = useSportCategories();
  const { data: stats, isLoading: isStatsLoading } = useSportStats(undefined);
  const {
    data: entriesData,
    isLoading: isEntriesLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSportEntries({
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

  const isInitialLoading =
    isCategoriesLoading || (isEntriesLoading && items.length === 0);

  if (isInitialLoading) {
    return <PageLoading testId="sport-category-loading" />;
  }

  const totalCount = entriesData?.pages[0]?.pagination.total ?? items.length;

  return (
    <div
      className="flex flex-col gap-3.5 pb-6 sm:gap-4"
      data-testid="sport-category-content"
    >
      <SportCategoryHeader
        category={currentCategory}
        categoryStats={categoryStats}
        colorIndex={categoryIndex !== -1 ? categoryIndex : 0}
        onAddActivity={onAddActivity}
      />

      <SportCategorySummary summary={summary} />

      {(summary.totalEntries > 0 || items.length > 0 || hasActiveFilters) && (
        <SportActivitiesFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onAddActivity={onAddActivity}
        />
      )}

      <SportActivitiesTable
        items={items}
        hasFilters={hasActiveFilters}
        onAddFirstItem={onAddActivity}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        totalCount={totalCount}
        loadedCount={items.length}
      />
    </div>
  );
};

export const SportCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: categories = [] } = useSportCategories();
  const { isCreateOpen, openCreate, closeCreate } = useSportRecordModals<SportEntry>();

  return (
    <SportsLayout onOpenAddEntry={openCreate}>
      <SportCategoryContent onAddActivity={openCreate} />
      <CreateSportActivityModal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        defaultCategoryId={categoryId}
        categories={categories}
      />
    </SportsLayout>
  );
};
