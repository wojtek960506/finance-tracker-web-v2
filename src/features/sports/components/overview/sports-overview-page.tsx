import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, LoadingCard } from '@shared/ui';

import type { SportEntry } from '../../api';
import { useSportCategories, useSportRecordModals, useSportStats } from '../../hooks';
import { CreateSportActivityModal } from '../activity-modals';
import { SportsLayout } from '../layout';

import { SportsCategoryBreakdown } from './sports-category-breakdown';
import { SportsOverviewEmptyState } from './sports-overview-empty-state';
import { SportsStatsCards } from './sports-stats-cards';
import { SportsTrendChart } from './sports-trend-chart';
import { SportsYearFilter } from './sports-year-filter';

export interface SportsOverviewContentProps {
  onAddActivity?: () => void;
}

export const SportsOverviewContent = ({
  onAddActivity,
}: SportsOverviewContentProps = {}) => {
  const { t } = useTranslation('sports');
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const { data: allTimeStats, isLoading: isAllTimeLoading } = useSportStats(undefined);
  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useSportStats(selectedYear !== undefined ? { year: selectedYear } : undefined);

  const availableYears = useMemo(() => {
    const years = (allTimeStats?.byYear ?? stats?.byYear ?? []).map((y) => y.year);
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [allTimeStats?.byYear, stats?.byYear]);

  if (isLoading || isAllTimeLoading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <LoadingCard
          title={t('title')}
          description={t('description')}
          widthClassName="max-w-[35rem]"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 p-8 text-center">
        <p className="text-sm text-destructive">
          {error?.message || t('toasts.entryCreateError')}
        </p>
        <Button type="button" variant="secondary" onClick={() => void refetch()}>
          {t('actions.save', { defaultValue: 'Retry' })}
        </Button>
      </div>
    );
  }

  const isEmpty = !stats || stats.totalEntries === 0;

  return (
    <div className="flex flex-col gap-4 pb-6" data-testid="sports-overview-content">
      {/* Year Filter Bar */}
      {availableYears.length > 0 && (
        <SportsYearFilter
          availableYears={availableYears}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      )}

      {/* Empty State */}
      {isEmpty && <SportsOverviewEmptyState onAddActivity={onAddActivity} />}

      {/* Stats Content */}
      {!isEmpty && (
        <div className="flex flex-col gap-4">
          <SportsStatsCards stats={stats} />

          <SportsTrendChart stats={stats} selectedYear={selectedYear} />

          <SportsCategoryBreakdown
            categories={stats.byCategory}
            totalCostPln={stats.totalCostPln}
          />
        </div>
      )}
    </div>
  );
};

export const SportsOverviewPage = () => {
  const { isCreateOpen, openCreate, closeCreate } = useSportRecordModals<SportEntry>();
  const { data: categories = [] } = useSportCategories();

  return (
    <SportsLayout onOpenAddEntry={openCreate}>
      <SportsOverviewContent onAddActivity={openCreate} />
      <CreateSportActivityModal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        categories={categories}
      />
    </SportsLayout>
  );
};
