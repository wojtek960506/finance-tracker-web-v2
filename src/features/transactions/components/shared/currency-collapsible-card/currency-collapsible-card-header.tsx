import clsx from 'clsx';
import { type ReactNode } from 'react';

import { useLanguage } from '@shared/hooks';
import { formatCurrencyAmount } from '@transactions/utils';

type CurrencyCollapsibleCardHeaderProps = {
  currency: string;
  balance: number;
  balanceClassName: string;
  rightContent: ReactNode;
  balanceCurrency?: string;
  className?: string;
};

export const CurrencyCollapsibleCardHeader = ({
  currency,
  balance,
  balanceClassName,
  rightContent,
  balanceCurrency,
  className,
}: CurrencyCollapsibleCardHeaderProps) => {
  const { language } = useLanguage();

  return (
    <div
      className={clsx(
        'flex min-w-0 flex-1 flex-wrap items-center justify-between gap-2 pl-1',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <h3 className="min-w-10 truncate text-left text-lg font-semibold sm:min-w-11 sm:text-xl">
          {currency}
        </h3>
        <div className={clsx('text-lg font-semibold sm:text-xl', balanceClassName)}>
          {balance >= 0 && '+'}
          {formatCurrencyAmount(balance, balanceCurrency, language)}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">{rightContent}</div>
    </div>
  );
};
