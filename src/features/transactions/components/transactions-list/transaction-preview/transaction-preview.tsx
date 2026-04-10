import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useLanguage } from '@shared/hooks';
import type { Transaction, TrashedTransaction } from '@transactions/api';
import { TransactionKindIcon } from '@transactions/components/shared';
import { getTransactionKind } from '@transactions/consts';
import { getTransactionNamedResourceLabel } from '@transactions/utils/get-transaction-named-resource-label';
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
  const { t } = useTranslation('transactions');
  const { t: tNamedResources } = useTranslation('namedResources');
  const { language } = useLanguage();
  const amountPresentation = getTransactionAmountPresentation(transaction);
  const transactionKind = getTransactionKind(transaction);
  const accountLabel = getTransactionNamedResourceLabel(
    transaction.account,
    tNamedResources,
  );
  const paymentMethodLabel = getTransactionNamedResourceLabel(
    transaction.paymentMethod,
    tNamedResources,
  );
  const categoryLabel = getTransactionNamedResourceLabel(
    transaction.category,
    tNamedResources,
  );

  const ghostLinkCn = 'text-sm sm:text-base';

  return (
    <li>
      <Card className="sm:gap-1">
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

        <footer className="flex items-center justify-between gap-1">
          <span
            className="inline-flex items-center rounded-xl border border-fg/50 bg-bg p-1 text-text-muted shadow-sm"
            aria-label={t(`${transactionKind}Transaction`)}
            title={t(`${transactionKind}Transaction`)}
            data-testid="transaction-kind-icon"
          >
            <TransactionKindIcon
              kind={transactionKind}
              aria-hidden
            />
          </span>
          <div className="flex flex-wrap justify-end gap-1">
            <ButtonLink to="/accounts" className={ghostLinkCn}>
              {accountLabel}
            </ButtonLink>
            <ButtonLink to="/paymentMethods" className={ghostLinkCn}>
              {paymentMethodLabel}
            </ButtonLink>
            <ButtonLink to="/categories" className={ghostLinkCn}>
              {categoryLabel}
            </ButtonLink>
          </div>
        </footer>
      </Card>
    </li>
  );
};
