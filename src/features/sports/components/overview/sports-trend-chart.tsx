import clsx from 'clsx';
import { BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '@shared/ui';

import { formatPln } from '../../utils';

import type { SportsTrendChartProps } from './types';

// TODO revisit this file to understand it
export const SportsTrendChart = ({ stats, selectedYear }: SportsTrendChartProps) => {
  const { t, i18n } = useTranslation('sports');
  const lang = i18n.language;

  // Determine whether to display monthly bars (for a selected year) or yearly bars
  const showMonthly = Boolean(selectedYear && stats.byMonth && stats.byMonth.length > 0);

  type BarItem = {
    key: string;
    label: string;
    cost: number;
    count: number;
  };

  const items: BarItem[] = showMonthly
    ? Array.from({ length: 12 }, (_, i) => {
        const monthNum = i + 1;
        const entry = stats.byMonth?.find((m) => m.month === monthNum);
        const date = new Date(selectedYear ?? 2026, i, 1);
        const monthLabel = new Intl.DateTimeFormat(lang, {
          month: 'short',
        }).format(date);

        return {
          key: `m-${monthNum}`,
          label: monthLabel,
          cost: entry?.totalCostPln ?? 0,
          count: entry?.entryCount ?? 0,
        };
      })
    : stats.byYear.map((y) => ({
        key: `y-${y.year}`,
        label: String(y.year),
        cost: y.totalCostPln,
        count: y.entryCount,
      }));

  if (items.length === 0 || items.every((i) => i.cost === 0)) {
    return null;
  }

  const maxCost = Math.max(...items.map((i) => i.cost), 1);

  return (
    <Card className="flex flex-col gap-3.5 p-4 sm:p-5" data-testid="sports-trend-chart">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-text-muted" />
          <h3 className="text-sm font-semibold tracking-tight text-fg sm:text-base">
            {showMonthly
              ? `${t('stats.monthlyTrend')} (${selectedYear})`
              : t('stats.yearlyTrend')}
          </h3>
        </div>
      </div>

      {/* Bar Chart Canvas */}
      <div className="flex h-44 items-end gap-1.5 pt-6 sm:h-52 sm:gap-3">
        {items.map((item) => {
          const heightPercent = Math.max(
            (item.cost / maxCost) * 100,
            item.cost > 0 ? 5 : 2,
          );

          return (
            <div
              key={item.key}
              className="group relative flex flex-1 flex-col items-center h-full justify-end"
              data-testid={`trend-bar-${item.key}`}
            >
              {/* Tooltip on hover */}
              <div
                className={clsx(
                  'pointer-events-none absolute -top-12 z-20 hidden flex-col items-center',
                  'rounded-lg border border-border bg-card-bg/95 px-2 py-1 shadow-md',
                  'group-hover:flex whitespace-nowrap text-center text-xs backdrop-blur-xs',
                )}
              >
                <span className="font-bold text-fg">{formatPln(item.cost, lang)}</span>
                <span className="text-[10px] text-text-muted">
                  {item.count} {t('entries.title').toLowerCase()}
                </span>
              </div>

              {/* Bar Fill */}
              <div
                className={clsx(
                  'w-full max-w-10 rounded-t-md transition-all duration-500 ease-out',
                  item.cost > 0
                    ? 'bg-primary/80 group-hover:bg-primary shadow-xs'
                    : 'bg-muted/30',
                )}
                style={{ height: `${heightPercent}%` }}
              />

              {/* Label */}
              <span className="mt-2 truncate text-[10px] font-medium text-text-muted sm:text-xs">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
