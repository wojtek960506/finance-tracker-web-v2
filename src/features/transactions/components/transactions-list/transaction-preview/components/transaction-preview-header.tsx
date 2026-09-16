import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import type { Transaction, TrashedTransaction } from '@transactions/api';
import { TransactionKindIcon } from '@transactions/components/shared';
import { getTransactionKind } from '@transactions/consts';
import { getTransactionAmountPresentation } from '@transactions/utils/transaction-amount';

type TransactionPreviewHeaderProps = {
  transaction: Transaction | TrashedTransaction;
};

export const TransactionPreviewHeader = ({
  transaction,
}: TransactionPreviewHeaderProps) => {
  const { t } = useTranslation('transactions');
  const { language } = useLanguage();
  const transactionKind = getTransactionKind(transaction);
  const amountPresentation = getTransactionAmountPresentation({
    ...transaction,
    language,
  });

  return (
    <header className="flex items-center justify-between text-sm text-text-muted sm:text-base">
      <div className="flex items-center gap-2">
        <span
          className={clsx(
            'inline-flex items-center rounded-xl border border-fg/50 bg-bg p-1',
            'text-text-muted shadow-sm',
          )}
          aria-label={t(`${transactionKind}Transaction`)}
          title={t(`${transactionKind}Transaction`)}
          data-testid="transaction-kind-icon"
        >
          <TransactionKindIcon kind={transactionKind} aria-hidden />
        </span>
        <time>{new Date(transaction.date).toLocaleDateString(language)}</time>
      </div>
      <span className={clsx('font-semibold', amountPresentation.valueClassName)}>
        {amountPresentation.formattedAmount}
      </span>
    </header>
  );
};
