import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { useLanguage } from '@shared/hooks';
import type { Transaction, TrashedTransaction } from '@transactions/api';
import { getTransactionAmountPresentation } from '@transactions/utils/transaction-amount';
import { ButtonLink, Card } from '@ui';

export const TransactionPreview = ({
  transaction,
  detailsPathPrefix = '/transactions',
  metadata,
}: {
  transaction: Transaction | TrashedTransaction;
  detailsPathPrefix?: string;
  metadata?: ReactNode;
}) => {
  const { language } = useLanguage();
  const amountPresentation = getTransactionAmountPresentation(transaction);

  const ghostLinkCn = 'text-sm sm:text-base';

  return (
    <li>
      <Card>
        <Link
          className={clsx(
            ' hover:text-active-nav block ',
            'focus-visible:rounded-md focus-visible:outline-solid focus-visible:outline-2',
            'focus-visible:outline-fg focus-visible:outline-offset-2',
          )}
          to={`${detailsPathPrefix}/${transaction.id}`}
          data-testid="transaction-preview-link"
        >
          <header className="flex justify-between text-text-muted text-sm sm:text-base">
            <time>{new Date(transaction.date).toLocaleDateString(language)}</time>
            <span className={clsx('font-semibold', amountPresentation.valueClassName)}>
              {amountPresentation.formattedAmount}
            </span>
          </header>

          <main className="py-0 sm:py-1">
            <h1 className="text-lg sm:text-xl font-semibold">
              {transaction.description}
            </h1>
            {metadata ? <div className="pt-1">{metadata}</div> : null}
          </main>
        </Link>

        <footer className="flex justify-end gap-1">
          <ButtonLink to="/accounts" className={ghostLinkCn}>
            {transaction.account.name}
          </ButtonLink>
          <ButtonLink to="/paymentMethods" className={ghostLinkCn}>
            {transaction.paymentMethod.name}
          </ButtonLink>
          <ButtonLink to="/categories" className={ghostLinkCn}>
            {transaction.category.name}
          </ButtonLink>
        </footer>
      </Card>
    </li>
  );
};
