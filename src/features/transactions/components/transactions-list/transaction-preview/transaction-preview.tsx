import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { useLanguage } from '@shared/hooks';
import type { Transaction } from '@transactions/api';
import { Button, Card } from '@ui';

const GhostLink = ({ to, children }: { to: string, children: ReactNode }) => (
  <Link to={to}>
    <Button variant="ghost" className="py-0 sm:py-0">{children}</Button>
  </Link>
)

export const TransactionPreview = ({ transaction }: { transaction: Transaction }) => {
  const { language } = useLanguage();

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
            <h1 className="text-lg md:text-xl font-semibold">
              {transaction.description}
            </h1>
          </main>
        </Link>

        <footer className="flex justify-end text-xs sm:text-sm gap-1">
          <GhostLink to="/accounts">{transaction.account.name}</GhostLink>
          <GhostLink to="/paymentMethods">{transaction.paymentMethod.name}</GhostLink>
          <GhostLink to="/categories">{transaction.category.name}</GhostLink>
        </footer>
      </Card>
    </li>
  );
};
