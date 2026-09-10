import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { useLanguage } from '@shared/hooks';
import type { Transaction, TrashedTransaction } from '@transactions/api';
import { TransactionKindIcon } from '@transactions/components/shared';
import { getTransactionKind } from '@transactions/consts';
import {
  getPathWithSearch,
  getTransactionNamedResourceLabel,
  getTransactionsReturnTo,
  getTransactionsRouteState,
} from '@transactions/utils';
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
  const { language } = useLanguage();
  const location = useLocation();
  const amountPresentation = getTransactionAmountPresentation({
    ...transaction,
    language,
  });
  const transactionKind = getTransactionKind(transaction);
  const returnTo = getTransactionsReturnTo(location.state, getPathWithSearch(location));

  // TODO Visibility of footer will be later adjustable in settings.
  const { t: tNamedResources } = useTranslation('namedResources');
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

  const isInvestment =
    transactionKind === 'investment' &&
    'investment' in transaction &&
    Boolean(transaction.investment);

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
          state={getTransactionsRouteState(returnTo)}
          data-testid="transaction-preview-link"
        >
          <header className="flex justify-between text-text-muted text-sm sm:text-base items-center">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center rounded-xl border border-fg/50 bg-bg p-1 text-text-muted shadow-sm"
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

          <main className="py-0 sm:py-1">
            <h1 className="text-lg sm:text-xl font-semibold">
              {transaction.description}
            </h1>
            {metadata ? (
              <div className="pt-1">{metadata}</div>
            ) : isInvestment && transaction.investment ? (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                <span
                  className={clsx(
                    'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold capitalize',
                    transaction.investment.operationKind === 'buy' &&
                      'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
                    transaction.investment.operationKind === 'sell' &&
                      'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                    transaction.investment.operationKind === 'interest' &&
                      'border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400',
                    transaction.investment.operationKind === 'fee' &&
                      'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
                  )}
                  data-testid="transaction-preview-operation-kind"
                >
                  {t(`operationKind.${transaction.investment.operationKind}`)}
                </span>
                <span
                  className="font-medium text-text-muted"
                  data-testid="transaction-preview-instrument-name"
                >
                  {transaction.investment.instrument.name}
                </span>
              </div>
            ) : null}
          </main>
        </Link>

        <footer className="flex flex-wrap justify-end items-center justify-between gap-1">
          <ButtonLink to="/accounts" className={ghostLinkCn}>
            {accountLabel}
          </ButtonLink>
          <ButtonLink to="/paymentMethods" className={ghostLinkCn}>
            {paymentMethodLabel}
          </ButtonLink>
          <ButtonLink to="/categories" className={ghostLinkCn}>
            {categoryLabel}
          </ButtonLink>
        </footer>
      </Card>
    </li>
  );
};
