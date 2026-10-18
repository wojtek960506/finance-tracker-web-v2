import type { SportEntry, SportStatsCategory } from '../../api';

import type { SportCategorySummaryData } from './types';

export const calculateSportCategorySummary = (
  items: SportEntry[],
  categoryStats?: SportStatsCategory | null,
): SportCategorySummaryData => {
  const linkedItems = items.filter((item) => Boolean(item.transactionId));
  const linkedCostPln = linkedItems.reduce((sum, item) => sum + item.costPln, 0);
  const linkedEntriesCount = linkedItems.length;

  const totalCostPln =
    categoryStats?.totalCostPln ?? items.reduce((sum, item) => sum + item.costPln, 0);
  const totalEntries = categoryStats?.entryCount ?? items.length;

  const linkedPercentage =
    totalCostPln > 0 ? Math.round((linkedCostPln / totalCostPln) * 100) : 0;

  return {
    totalCostPln,
    totalEntries,
    linkedCostPln,
    linkedEntriesCount,
    linkedPercentage,
  };
};
