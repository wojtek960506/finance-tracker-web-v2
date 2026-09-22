import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import { Card } from '@shared/ui';

import type { NetWorthAllocationItemDTO } from '../api';

import { NetWorthAllocationItem } from './net-worth-allocation-item';
import { NetWorthAllocationProgressBar } from './net-worth-allocation-progress-bar';

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

      <NetWorthAllocationProgressBar allocation={allocation} />

      {/* Category breakdown grid */}
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2 xl:grid-cols-3">
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
