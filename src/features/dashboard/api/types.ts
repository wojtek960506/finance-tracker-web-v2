import type { components, operations } from '@shared/types/api.generated';

export type DashboardSummaryResponseDTO =
  components['schemas']['DashboardSummaryResponse'];

export type DashboardTransactionsSummaryDTO =
  components['schemas']['DashboardTransactionsSummary'];

export type DashboardTransactionCurrencyItemDTO =
  components['schemas']['DashboardTransactionCurrencyItem'];

export type DashboardInvestmentsSummaryDTO =
  components['schemas']['DashboardInvestmentsSummary'];

export type DashboardVehiclesSummaryDTO =
  components['schemas']['DashboardVehiclesSummary'];

export type DashboardSportsSummaryDTO = components['schemas']['DashboardSportsSummary'];

export type DashboardTransactionResponse = components['schemas']['TransactionResponse'];

export type DashboardSummaryQueryParams = NonNullable<
  operations['get_dashboard_summary']['parameters']['query']
>;
