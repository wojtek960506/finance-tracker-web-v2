import { Award, CalendarRange, Flame, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { formatPln, getCategoryDisplayName } from '../../utils';

import { SportsStatCard } from './sports-stat-card';
import type { SportsStatsCardsProps } from './types';

export const SportsStatsCards = ({ stats }: SportsStatsCardsProps) => {
  const { t, i18n } = useTranslation('sports');
  const lang = i18n.language;

  // Find top category
  const topCategory =
    stats.byCategory.length > 0
      ? [...stats.byCategory].sort((a, b) => b.totalCostPln - a.totalCostPln)[0]
      : null;

  const topCategoryName = topCategory
    ? getCategoryDisplayName(
        {
          name: topCategory.categoryName,
          type: topCategory.type,
          categoryKey: topCategory.categoryKey,
        },
        t,
      )
    : '-';

  const topCategorySubtext = topCategory
    ? `${formatPln(topCategory.totalCostPln, lang)} (${topCategory.percentage}%)`
    : undefined;

  // Calculate monthly average
  let monthlyAverage = 0;
  if (stats.byMonth && stats.byMonth.length > 0) {
    const activeMonths = stats.byMonth.filter((m) => m.totalCostPln > 0).length || 1;
    monthlyAverage = stats.totalCostPln / activeMonths;
  } else if (stats.byYear.length > 0) {
    monthlyAverage = stats.totalCostPln / (stats.byYear.length * 12);
  }

  return (
    <div
      className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4"
      data-testid="sports-stats-cards"
    >
      <SportsStatCard
        title={t('stats.totalSpending')}
        value={formatPln(stats.totalCostPln, lang)}
        Icon={Wallet}
        iconClassName="text-emerald-500"
        data-testid="stats-card-total-spent"
      />

      <SportsStatCard
        title={t('stats.totalEntries')}
        value={String(stats.totalEntries)}
        Icon={Flame}
        iconClassName="text-amber-500"
        data-testid="stats-card-total-entries"
      />

      <SportsStatCard
        title={t('stats.topCategory')}
        value={topCategoryName}
        subtext={topCategorySubtext}
        Icon={Award}
        iconClassName="text-violet-500"
        data-testid="stats-card-top-category"
      />

      <SportsStatCard
        title={t('stats.monthlyAverage')}
        value={formatPln(monthlyAverage, lang)}
        Icon={CalendarRange}
        iconClassName="text-blue-500"
        data-testid="stats-card-monthly-avg"
      />
    </div>
  );
};
