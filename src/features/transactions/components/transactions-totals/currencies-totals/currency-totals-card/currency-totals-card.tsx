import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import type { TransactionTotalsByCurrency } from '@transactions/api';
import { formatCurrencyAmount } from '@transactions/utils/currency-amount';
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
  const { language } = useLanguage();
  const balance = totals.income.totalAmount - totals.expense.totalAmount;
  const balanceClassName = balance < 0 ? 'text-destructive' : 'text-bt-primary';

  // TODO think about unifying usage of `formatCurrencyAmount` and
  // `getTransactionAmountPresentation`
  return (
    <Card className="currency-totals-card-container gap-0 rounded-2xl border-fg/15 bg-bg/55 p-0 sm:p-0 shadow-none">
      <Collapsible
        header={
          <div className="pl-1 flex min-w-0 flex-1 flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="truncate text-lg font-semibold sm:text-xl min-w-10 sm:min-w-11 text-left">
                {currency}
              </h3>
              <div
                className={clsx('text-base sm:text-lg font-semibold', balanceClassName)}
              >
                {balance >= 0 && '+'}
                {formatCurrencyAmount(balance, undefined, language)}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <div className="rounded-full bg-bg px-3 py-1 text-sm font-semibold text-text">
                <span className="currency-totals-total-items-label">
                  {t('totalItems')}:
                </span>{' '}
                {totals.totalItems}
              </div>
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
