import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { useLanguage } from '@shared/hooks';
import type { Transaction } from '@transactions/api';
import { ButtonLink, Card } from '@ui';

export const TransactionPreview = ({ transaction }: { transaction: Transaction }) => {
  const { language } = useLanguage();

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
          to={`/transactions/${transaction.id}`}
          data-testid="transaction-preview-link"
        >
          <header className="flex justify-between text-text-muted text-sm sm:text-base">
            <time>{new Date(transaction.date).toLocaleDateString(language)}</time>
            <span className="font-semibold">
              {transaction.amount.toFixed(2)} {transaction.currency}
            </span>
          </header>

          <main className="py-0 sm:py-1">
            <h1 className="text-lg sm:text-xl font-semibold">
              {transaction.description}
            </h1>
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
