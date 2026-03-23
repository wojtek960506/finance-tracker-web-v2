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
          className="hover:text-active-nav border-fg border-b pb-2 mb-2"
          to={`/transactions/${transaction.id}`}
        >
          <header className="flex justify-between text-text-muted">
            <time>{new Date(transaction.date).toLocaleDateString(language)}</time>
            <span className="font-semibold">
              {transaction.amount.toFixed(2)} {transaction.currency}
            </span>
          </header>

          <main className="py-1">
            <h1 className="text-xl font-semibold">{transaction.description}</h1>
          </main>
        </Link>

        <footer className="flex justify-end text-sm">
          <Link to="/accounts">
            <Button variant="ghost" className="py-0">
              {transaction.account.name}
            </Button>
          </Link>
          <Link to="/paymentMethods">
            <Button variant="ghost" className="py-0">
              {transaction.paymentMethod.name}
            </Button>
          </Link>
          <Link to="/categories">
            <Button variant="ghost" className="py-0">
              {transaction.category.name}
            </Button>
          </Link>
        </footer>
      </Card>
    </li>
  );
};
