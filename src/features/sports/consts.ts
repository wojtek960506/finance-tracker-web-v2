import type { SportEntrySortOption } from './api/types';

export const DEFAULT_SPORTS_PAGE_LIMIT = 50;

export const SPORTS_SORT_OPTIONS: {
  value: SportEntrySortOption;
  labelKey: string;
}[] = [
  { value: 'date_desc', labelKey: 'sort.dateDesc' },
  { value: 'date_asc', labelKey: 'sort.dateAsc' },
  { value: 'cost_desc', labelKey: 'sort.costDesc' },
  { value: 'cost_asc', labelKey: 'sort.costAsc' },
];

export const SPORTS_CATEGORY_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ec4899', // pink-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#14b8a6', // teal-500
  '#6366f1', // indigo-500
  '#84cc16', // lime-500
  '#64748b', // slate-500
];
