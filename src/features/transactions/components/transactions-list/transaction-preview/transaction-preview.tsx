import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

import type { Transaction, TrashedTransaction } from '@transactions/api';
import {
  getPathWithSearch,
  getTransactionsReturnTo,
  getTransactionsRouteState,
} from '@transactions/utils';
import { Card } from '@ui';

import {
  InvestmentPreviewMetadata,
  TransactionPreviewFooter,
  TransactionPreviewHeader,
} from './components';

type TransactionPreviewProps = {
  transaction: Transaction | TrashedTransaction;
  detailsPathPrefix?: string;
  metadata?: ReactNode;
};

export const TransactionPreview = ({
  transaction,
  detailsPathPrefix = '/transactions',
  metadata,
}: TransactionPreviewProps) => {
  const location = useLocation();
  const returnTo = getTransactionsReturnTo(location.state, getPathWithSearch(location));

  const isInvestment =
    transaction.kind === 'investment' &&
    'investment' in transaction &&
    Boolean(transaction.investment);

  return (
    <li>
      <Card className="sm:gap-1">
        <Link
          className={clsx(
            'block hover:text-active-nav',
            'focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-solid',
            'focus-visible:outline-offset-2 focus-visible:outline-fg',
          )}
          to={`${detailsPathPrefix}/${transaction.id}`}
          state={getTransactionsRouteState(returnTo)}
          data-testid="transaction-preview-link"
        >
          <TransactionPreviewHeader transaction={transaction} />

          <main className="py-0 sm:py-1">
            <h1 className="text-lg font-semibold sm:text-xl">
              {transaction.description}
            </h1>
            {metadata && <div className="pt-1">{metadata}</div>}
            {!metadata && isInvestment && transaction.investment && (
              <InvestmentPreviewMetadata investment={transaction.investment} />
            )}
          </main>
        </Link>

        <TransactionPreviewFooter transaction={transaction} />
      </Card>
    </li>
  );
};
