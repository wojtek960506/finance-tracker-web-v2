import clsx from 'clsx';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { SportsYearFilterProps } from './types';

export const SportsYearFilter = ({
  availableYears,
  selectedYear,
  onYearChange,
}: SportsYearFilterProps) => {
  const { t } = useTranslation('sports');

  if (availableYears.length === 0) {
    return null;
  }

  const sortedYears = [...availableYears].sort((a, b) => b - a);

  return (
    <div
      className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs"
      data-testid="sports-year-filter"
    >
      <div className="flex items-center gap-1 text-text-muted mr-1 shrink-0">
        <Calendar className="size-3.5" />
        <span className="font-medium">{t('stats.yearFilter')}:</span>
      </div>

      {/* All Time Option */}
      <button
        type="button"
        onClick={() => onYearChange(undefined)}
        className={clsx(
          'rounded-lg px-2.5 py-1 font-medium transition-colors whitespace-nowrap shrink-0',
          selectedYear === undefined
            ? 'bg-fg text-bg shadow-xs'
            : 'border border-border bg-card-bg text-text-muted hover:bg-bt-ghost-hover hover:text-fg',
        )}
        data-testid="sports-year-filter-all"
      >
        {t('stats.allYears')}
      </button>

      {/* Year Options */}
      {sortedYears.map((year) => (
        <button
          key={year}
          type="button"
          onClick={() => onYearChange(year)}
          className={clsx(
            'rounded-lg px-2.5 py-1 font-medium transition-colors whitespace-nowrap shrink-0',
            selectedYear === year
              ? 'bg-fg text-bg shadow-xs'
              : 'border border-border bg-card-bg text-text-muted hover:bg-bt-ghost-hover hover:text-fg',
          )}
          data-testid={`sports-year-filter-${year}`}
        >
          {year}
        </button>
      ))}
    </div>
  );
};
