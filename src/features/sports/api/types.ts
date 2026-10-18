import type { components } from '@shared/types/api.generated';

export type SportCategoryType = 'user' | 'system';

export type SportCategory = components['schemas']['NamedResourceResponse'];

export type SportCategoryCreate = components['schemas']['NamedResource'];

export type SportCategoryUpdate = components['schemas']['NamedResource'];

export type PopulatedSportCategory = components['schemas']['SportEntryCategoryResponse'];

export type SportEntrySortOption = 'date_desc' | 'date_asc' | 'cost_desc' | 'cost_asc';

export type SportEntry = components['schemas']['SportEntryResponse'];

export type SportEntryCreate = components['schemas']['SportEntryCreate'];

export type SportEntryUpdate = components['schemas']['SportEntryUpdate'];

export type SportPagination = components['schemas']['SportPagination'];

export type SportEntryListResponse = components['schemas']['SportEntryListResponse'];

export type SportStatsCategory = components['schemas']['SportStatsCategory'];

export type SportStatsYear = components['schemas']['SportStatsYear'];

export type SportStatsMonth = components['schemas']['SportStatsMonth'];

export type SportStatsResponse = components['schemas']['SportStatsResponse'];

export type LinkSportSpendingsPayload =
  components['schemas']['LinkSportSpendingsToTransaction'];

export type UnlinkSportSpendingPayload =
  components['schemas']['UnlinkSportSpendingFromTransaction'];

export type SportSpendingLinkResponse =
  components['schemas']['SportSpendingLinkResponse'];

export interface SportSpendingTarget {
  id: string;
  costPln: number;
  date: string;
  itemName: string;
  categoryId?: string;
  categoryName?: string;
  transactionId?: string | null;
}

export interface SportEntryFilterQuery {
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sort?: SportEntrySortOption;
  page?: number;
  limit?: number;
}

export interface SportStatsQuery {
  year?: number;
}
