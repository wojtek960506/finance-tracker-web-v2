import clsx from 'clsx';

import { useLanguage } from '@shared/hooks';
import { formatCurrencyAmount } from '@transactions/utils';

const BALANCE_POSITIVE_CLASS = 'text-bt-primary';
const BALANCE_NEGATIVE_CLASS = 'text-destructive';

type TransactionAccountStatisticsAccountCardAmountProps = {
  amount?: number;
  currency: string;
  size?: 'primary' | 'secondary';
};

export const TransactionAccountStatisticsAccountCardAmount = ({
  amount,
  currency,
  size = 'primary',
}: TransactionAccountStatisticsAccountCardAmountProps) => {
  const { language } = useLanguage();

  if (amount === undefined) return null;

  return (
    <div
      className={clsx(
        'flex flex-wrap items-baseline gap-2 font-semibold',
        amount < 0 ? BALANCE_NEGATIVE_CLASS : BALANCE_POSITIVE_CLASS,
        size === 'primary' ? 'text-lg sm:text-xl' : 'text-sm',
      )}
    >
      <span>
        {amount >= 0 && '+'}
        {formatCurrencyAmount(amount, currency, language)}
      </span>
    </div>
  );
};
