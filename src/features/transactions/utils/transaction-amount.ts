import type { Transaction, TransactionType, TrashedTransaction } from '@transactions/api';

import { formatDecimal } from './currency-amount';

type TransactionAmountSource = Pick<
  Transaction | TrashedTransaction,
  'amount' | 'currency' | 'transactionType'
> & {
  language: string;
};

type TransactionAmountPresentation = {
  formattedAmount: string;
  labelClassName: string;
  valueClassName: string;
};

const getTransactionAmountTone = (transactionType: TransactionType) =>
  transactionType === 'expense'
    ? {
        labelClassName: 'text-transaction-expense-label',
        valueClassName: 'text-destructive',
      }
    : {
        labelClassName: 'text-transaction-income-label',
        valueClassName: 'text-bt-primary',
      };

export const getTransactionAmountPresentation = ({
  amount,
  currency,
  transactionType,
  language,
}: TransactionAmountSource): TransactionAmountPresentation => {
  const sign = transactionType === 'expense' ? '-' : '+';

  return {
    formattedAmount: `${sign}${formatDecimal(amount, language)} ${currency}`,
    ...getTransactionAmountTone(transactionType),
  };
};
