import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import type { TransactionAccountStatisticsCurrency } from '@transactions/api';
import { formatCurrencyAmount } from '@transactions/utils';

const BALANCE_POSITIVE_CLASS = 'text-bt-primary';
const BALANCE_NEGATIVE_CLASS = 'text-destructive';

type TransactionAccountStatisticsCurrencyGroupBadgesProps = {
  currencyGroup: TransactionAccountStatisticsCurrency;
  baseCurrency: string;
};

export const TransactionAccountStatisticsCurrencyGroupBadges = ({
  currencyGroup,
  baseCurrency,
}: TransactionAccountStatisticsCurrencyGroupBadgesProps) => {
  const { t } = useTranslation('transactions');
  const { language } = useLanguage();
  const normalizedAmountClassName =
    currencyGroup.normalizedTotalAmount !== undefined &&
    currencyGroup.normalizedTotalAmount < 0
      ? BALANCE_NEGATIVE_CLASS
      : BALANCE_POSITIVE_CLASS;

  return (
    <>
      {currencyGroup.normalizedTotalAmount !== undefined ? (
        <div
          className={clsx(
            'rounded-full bg-bg px-3 py-1 text-sm font-semibold',
            normalizedAmountClassName,
          )}
        >
          {currencyGroup.normalizedTotalAmount >= 0 && '+'}
          {formatCurrencyAmount(
            currencyGroup.normalizedTotalAmount,
            baseCurrency,
            language,
          )}
        </div>
      ) : null}
      <div className="rounded-full bg-bg px-3 py-1 text-sm font-semibold text-text">
        {t('accounts', { count: currencyGroup.accounts.length })}
      </div>
      <div className="rounded-full bg-bg px-3 py-1 text-sm font-semibold text-text">
        {t('transactionsCountSummary', { count: currencyGroup.totalItems })}
      </div>
    </>
  );
};
