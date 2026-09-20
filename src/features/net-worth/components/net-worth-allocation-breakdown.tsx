import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import { Card } from '@shared/ui';

import type { NetWorthAllocationItemDTO, NetWorthCategory } from '../api';
import { FALLBACK_CATEGORY_STYLE, NET_WORTH_CATEGORY_STYLES } from '../consts';
import { formatCurrencyAmount, formatPercentage } from '../utils';

type NetWorthAllocationBreakdownProps = {
  allocation: NetWorthAllocationItemDTO[];
  baseCurrency: string;
};

export const NetWorthAllocationBreakdown = ({
  allocation,
  baseCurrency,
}: NetWorthAllocationBreakdownProps) => {
  const { t } = useTranslation('net-worth');
  const { language } = useLanguage();

  if (allocation.length === 0) return null;

  return (
    <Card
      className="flex flex-col gap-4 p-4"
      data-testid="net-worth-allocation-breakdown"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
          {t('assetAllocation')}
        </h2>
        <p className="text-xs text-text-muted">{t('assetAllocationDescription')}</p>
      </div>

      {/* Multi-segment visual progress bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-fg/5 p-0.5">
        {allocation.map((item) => {
          const style =
            NET_WORTH_CATEGORY_STYLES[item.category as NetWorthCategory] ??
            FALLBACK_CATEGORY_STYLE;

          if (item.percentage <= 0) return null;

          return (
            <div
              key={item.category}
              title={`${t(`categories.${item.category}`, { defaultValue: item.category })}: ${formatPercentage(item.percentage, language)}%`}
              style={{ width: `${Math.max(item.percentage, 1)}%` }}
              className={clsx(
                'h-full first:rounded-l-full last:rounded-r-full',
                style.progressClass,
              )}
            />
          );
        })}
      </div>

      {/* Category breakdown grid */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {allocation.map((item) => {
          const style =
            NET_WORTH_CATEGORY_STYLES[item.category as NetWorthCategory] ??
            FALLBACK_CATEGORY_STYLE;
          const Icon = style.icon;
          const categoryName = t(`categories.${item.category}`, {
            defaultValue: item.category,
          });

          return (
            <div
              key={item.category}
              className={clsx(
                'flex items-center justify-between gap-3 rounded-xl border border-fg/10',
                'bg-surface/40 p-3 transition-all hover:bg-surface/70',
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={clsx(
                    'flex size-8 shrink-0 items-center justify-center rounded-lg',
                    style.bgClass,
                  )}
                >
                  <Icon className={clsx('size-4', style.colorClass)} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-xs font-semibold text-foreground sm:text-sm">
                    {categoryName}
                  </span>
                  <span className="text-xs font-medium text-text-muted">
                    {formatPercentage(item.percentage, language)}%
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className="text-xs font-bold text-foreground sm:text-sm">
                  {formatCurrencyAmount(item.amount, baseCurrency, language)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
