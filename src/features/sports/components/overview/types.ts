import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import type { SportStatsCategory, SportStatsResponse } from '../../api/types';

export interface SportsStatCardProps {
  title: string;
  value: string;
  subtext?: string;
  Icon: LucideIcon;
  iconClassName?: string;
  badge?: ReactNode;
  'data-testid'?: string;
}

export interface SportsStatsCardsProps {
  stats: SportStatsResponse;
}

export interface SportsCategoryBreakdownProps {
  categories: SportStatsCategory[];
  totalCostPln: number;
}

export interface SportsTrendChartProps {
  stats: SportStatsResponse;
  selectedYear?: number;
}

export interface SportsYearFilterProps {
  availableYears: number[];
  selectedYear?: number;
  onYearChange: (year?: number) => void;
}
