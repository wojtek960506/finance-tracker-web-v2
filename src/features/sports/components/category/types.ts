import type { SportCategory, SportStatsCategory } from '../../api';

export interface SportCategorySummaryData {
  totalCostPln: number;
  totalEntries: number;
  linkedCostPln: number;
  linkedEntriesCount: number;
  linkedPercentage: number;
}

export interface SportCategorySummaryProps {
  summary?: SportCategorySummaryData;
  isLoading?: boolean;
  'data-testid'?: string;
}

export interface SportCategoryHeaderProps {
  category?: SportCategory | null;
  categoryStats?: SportStatsCategory | null;
  colorIndex?: number;
  onAddActivity?: () => void;
  isLoading?: boolean;
  'data-testid'?: string;
}
