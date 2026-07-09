import { useTranslation } from 'react-i18next';

import type { TransactionTotalsByCurrency } from '@transactions/api';
import {
  CurrencyCollapsibleCard,
  CurrencyCollapsibleCardHeader,
} from '@transactions/components/shared';

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
  const balance = totals.income.totalAmount - totals.expense.totalAmount;
  const balanceClassName = balance < 0 ? 'text-destructive' : 'text-bt-primary';

  // TODO think about unifying usage of `formatCurrencyAmount` and
  // `getTransactionAmountPresentation`
  return (
    <CurrencyCollapsibleCard
      header={
        <CurrencyCollapsibleCardHeader
          currency={currency}
          balance={balance}
          balanceClassName={balanceClassName}
          rightContent={
            <div className="rounded-full bg-bg px-3 py-1 text-sm font-semibold text-text">
              <span className="currency-totals-total-items-label">
                {t('totalItems')}:
              </span>{' '}
              {totals.totalItems}
            </div>
          }
        />
      }
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <CurrencyTotalsMetrics currency={currency} totals={totals} />
    </CurrencyCollapsibleCard>
  );
};
