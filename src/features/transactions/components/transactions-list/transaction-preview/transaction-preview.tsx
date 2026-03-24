import { Link } from 'react-router-dom';

import { useLanguage } from '@shared/hooks';
import type { Transaction } from '@transactions/api';
import { Card, GhostLink } from '@ui';

export const TransactionPreview = ({ transaction }: { transaction: Transaction }) => {
  const { language } = useLanguage();

  const ghostLinkCn = 'text-sm sm:text-base';

  return (
    <li>
      <Card>
        <Link
          className="hover:text-active-nav border-fg border-b pb-2 mb-2"
          to={`/transactions/${transaction.id}`}
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
          <GhostLink to="/accounts" className={ghostLinkCn}>
            {transaction.account.name}
          </GhostLink>
          <GhostLink to="/paymentMethods" className={ghostLinkCn}>
            {transaction.paymentMethod.name}
          </GhostLink>
          <GhostLink to="/categories" className={ghostLinkCn}>
            {transaction.category.name}
          </GhostLink>
        </footer>
      </Card>
    </li>
  );
};
