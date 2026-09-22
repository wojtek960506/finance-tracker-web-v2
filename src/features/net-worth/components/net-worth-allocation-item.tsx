import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import type { NetWorthAllocationItemDTO, NetWorthCategory } from '../api';
import { FALLBACK_CATEGORY_STYLE, NET_WORTH_CATEGORY_STYLES } from '../consts';
import { formatCurrencyAmount, formatPercentage } from '../utils';

export type NetWorthAllocationItemProps = {
  item: NetWorthAllocationItemDTO;
  baseCurrency: string;
  language: string;
};

export const NetWorthAllocationItem = ({
  item,
  baseCurrency,
  language,
}: NetWorthAllocationItemProps) => {
  const { t } = useTranslation('net-worth');
  const style =
    NET_WORTH_CATEGORY_STYLES[item.category as NetWorthCategory] ??
    FALLBACK_CATEGORY_STYLE;
  const Icon = style.icon;
  const categoryName = t(`categories.${item.category}`, {
    defaultValue: item.category,
  });

  return (
    <div
      className={clsx(
        'flex items-center justify-between gap-3 rounded-xl border border-fg/10',
        'bg-surface/40 p-3 transition-all hover:bg-surface/70',
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className={clsx(
            'flex size-8 shrink-0 items-center justify-center rounded-lg',
            style.bgClass,
          )}
        >
          <Icon className={clsx('size-4', style.colorClass)} />
        </div>
        <div className="flex min-w-0 flex-col">
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
};
