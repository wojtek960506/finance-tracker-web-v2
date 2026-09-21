import type { components } from '@shared/types/api.generated';

export type NetWorthResponseDTO = components['schemas']['NetWorthResponse'];
export type NetWorthTotalsDTO = components['schemas']['NetWorthTotals'];
export type NetWorthCurrencyBreakdownDTO =
  components['schemas']['NetWorthCurrencyBreakdown'];
export type NetWorthAllocationItemDTO = components['schemas']['NetWorthAllocationItem'];
export type NetWorthCategory =
  components['schemas']['NetWorthAllocationItem']['category'];
export type NetWorthCurrencyCode =
  components['schemas']['NetWorthCurrencyBreakdown']['currency'];

export type GetNetWorthParams = {
  baseCurrency?: string;
};

export type NetWorthIndependencePeriodDTO =
  components['schemas']['NetWorthIndependencePeriod'];
export type NetWorthIndependenceCapitalDTO =
  components['schemas']['NetWorthIndependenceCapital'];
export type NetWorthIndependenceMonthlyAveragesDTO =
  components['schemas']['NetWorthIndependenceMonthlyAverages'];
export type NetWorthIndependenceHorizonDTO =
  components['schemas']['NetWorthIndependenceHorizon'];
export type NetWorthZeroIncomeBaselineDTO =
  components['schemas']['NetWorthZeroIncomeBaseline'];
export type ExcludedCategoryItemDTO = components['schemas']['ExcludedCategoryItem'];
export type NetWorthIndependenceResponseDTO =
  components['schemas']['NetWorthIndependenceResponse'];

export type GetNetWorthIndependenceParams = {
  baseCurrency?: string;
  periodMonths?: number;
  startDate?: string;
  endDate?: string;
  excludeCategoryIds?: string;
  excludeCategoryNames?: string;
};
