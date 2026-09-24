import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';

import type { NetWorthAllocationItemDTO, NetWorthCategory } from '../api';
import { FALLBACK_CATEGORY_STYLE, NET_WORTH_CATEGORY_STYLES } from '../consts';
import { formatPercentage } from '../utils';

export type NetWorthAllocationProgressBarProps = {
  allocation: NetWorthAllocationItemDTO[];
};

export const NetWorthAllocationProgressBar = ({
  allocation,
}: NetWorthAllocationProgressBarProps) => {
  const { t } = useTranslation('net-worth');
  const { language } = useLanguage();

  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-fg/5 p-0.5">
      {allocation.map((item) => {
        const style =
          NET_WORTH_CATEGORY_STYLES[item.category as NetWorthCategory] ??
          FALLBACK_CATEGORY_STYLE;

        if (item.percentage <= 0) return null;

        const categoryTitle = t(`categories.${item.category}`, {
          defaultValue: item.category,
        });

        return (
          <div
            key={item.category}
            title={`${categoryTitle}: ${formatPercentage(item.percentage, language)}%`}
            style={{ width: `${Math.max(item.percentage, 1)}%` }}
            className={clsx(
              'h-full first:rounded-l-full last:rounded-r-full',
              style.progressClass,
            )}
          />
        );
      })}
    </div>
  );
};
