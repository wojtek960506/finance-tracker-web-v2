import type { SportEntryFilterQuery, SportStatsQuery } from './types';

export const sportsQueryKeys = {
  all: ['sports'] as const,
  entries: () => [...sportsQueryKeys.all, 'entries'] as const,
  entryList: (filters?: SportEntryFilterQuery) =>
    [...sportsQueryKeys.entries(), 'list', filters] as const,
  entryDetails: (id: string) => [...sportsQueryKeys.entries(), 'detail', id] as const,
  categories: () => [...sportsQueryKeys.all, 'categories'] as const,
  categoryFavorites: () => [...sportsQueryKeys.categories(), 'favorites'] as const,
  categoryDetails: (id: string) =>
    [...sportsQueryKeys.categories(), 'detail', id] as const,
  stats: (query?: SportStatsQuery) => [...sportsQueryKeys.all, 'stats', query] as const,
};
