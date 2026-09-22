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
