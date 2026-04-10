import type { Transaction, TransactionType, TrashedTransaction } from '@transactions/api';

type TransactionAmountSource = Pick<
  Transaction | TrashedTransaction,
  'amount' | 'currency' | 'transactionType'
>;

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
}: TransactionAmountSource): TransactionAmountPresentation => {
  const sign = transactionType === 'expense' ? '-' : '+';

  return {
    formattedAmount: `${sign}${amount.toFixed(2)} ${currency}`,
    ...getTransactionAmountTone(transactionType),
  };
};
