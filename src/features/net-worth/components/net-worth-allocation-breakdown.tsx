import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import { Card } from '@shared/ui';

import type { NetWorthAllocationItemDTO, NetWorthCategory } from '../api';
import { FALLBACK_CATEGORY_STYLE, NET_WORTH_CATEGORY_STYLES } from '../consts';
import { formatPercentage } from '../utils';

import { NetWorthAllocationItem } from './net-worth-allocation-item';

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
        {allocation.map((item) => (
          <NetWorthAllocationItem
            key={item.category}
            item={item}
            baseCurrency={baseCurrency}
            language={language}
          />
        ))}
      </div>
    </Card>
  );
};
