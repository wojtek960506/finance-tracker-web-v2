import { Link } from 'react-router-dom';

import type { Transaction } from '@transactions/api';
import { Button, Card } from '@ui';

import { useLanguage } from '@/shared/hooks';

export const TransactionPreview = ({ transaction }: { transaction: Transaction }) => {
  const { language } = useLanguage();

  return (
    <li>
      <Card>
        <Link
          className="hover:text-active-nav border-fg border-b pb-1 md:pb-2 mb-1 md:mb-2"
          to={`/transactions/${transaction.id}`}
        >
          <header className="flex justify-between text-text-muted text-sm md:text-md">
            <time>{new Date(transaction.date).toLocaleDateString(language)}</time>
            <span className="font-semibold">
              {transaction.amount.toFixed(2)} {transaction.currency}
            </span>
          </header>

          <main className="py-1">
            <h1 className="text-lg md:text-xl font-semibold">
              {transaction.description}
            </h1>
          </main>
        </Link>

        <footer className="flex justify-end text-xs sm:text-sm gap-1">
          <Link to="/accounts">
            <Button variant="ghost" className="py-0 md:py-0">
              {transaction.account.name}
            </Button>
          </Link>
          <Link to="/paymentMethods">
            <Button variant="ghost" className="py-0 md:py-0">
              {transaction.paymentMethod.name}
            </Button>
          </Link>
          <Link to="/categories">
            <Button variant="ghost" className="py-0 md:py-0">
              {transaction.category.name}
            </Button>
          </Link>
        </footer>
      </Card>
    </li>
  );
};
