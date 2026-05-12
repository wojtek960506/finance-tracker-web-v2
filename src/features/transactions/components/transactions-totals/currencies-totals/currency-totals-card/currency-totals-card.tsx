import { useTranslation } from 'react-i18next';

import type { TransactionTotalsByCurrency } from '@transactions/api';
import { Card, Collapsible } from '@ui';

import { CurrencyTotalsMetrics } from './currency-totals-metrics';

export const CurrencyTotalsCard = ({
  currency,
  totals,
  isOpen,
  onOpenChange,
}: {
  currency: string;
  totals: TransactionTotalsByCurrency;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) => {
  const { t } = useTranslation('transactions');

  return (
    <Card className="gap-0 rounded-2xl border-fg/15 bg-bg/55 p-0 sm:p-0 shadow-none">
      <Collapsible
        header={
          <div className="pl-1 flex min-w-0 flex-1 flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-baseline gap-2">
              <h3 className="truncate text-lg font-semibold sm:text-xl">{currency}</h3>
            </div>
            <div className="rounded-full bg-bg px-3 py-1 text-sm font-semibold text-text">
              {t('totalItems')}: {totals.totalItems}
            </div>
          </div>
        }
        indicatorPosition="left"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        triggerMode="full-row"
        contentInset="none"
        triggerClassName="justify-between rounded-2xl sm:rounded-3xl border-0 p-3 sm:p-4"
        contentClassName="px-3 pb-3 sm:px-4 sm:pb-4"
      >
        <CurrencyTotalsMetrics currency={currency} totals={totals} />
      </Collapsible>
    </Card>
  );
};
