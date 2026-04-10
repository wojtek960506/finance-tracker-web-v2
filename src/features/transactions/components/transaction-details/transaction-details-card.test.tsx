import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import {
  makeTransaction,
  makeTrashedTransaction,
} from '@test-utils/factories/transaction';

import { TransactionDetailsCard } from './transaction-details-card';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@shared/hooks', () => ({
  useLanguage: () => ({ language: 'en-US' }),
}));

vi.mock('@ui', () => ({
  Card: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  HoverLink: ({ to, children }: { to: string; children: ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

describe('TransactionDetailsCard', () => {
  it('renders expense amount with semantic styling and without transaction type row', () => {
    render(
      <MemoryRouter>
        <TransactionDetailsCard transaction={makeTransaction()} />
      </MemoryRouter>,
    );

    expect(screen.getByText('amount')).toHaveClass('text-transaction-expense-label');
    expect(screen.getByText('-10.00 USD')).toHaveClass(
      'text-destructive',
      'font-semibold',
    );
    expect(screen.queryByText('transactionType')).not.toBeInTheDocument();
    expect(screen.queryByText('expense')).not.toBeInTheDocument();
  });

  it('renders income amount with primary styling', () => {
    render(
      <MemoryRouter>
        <TransactionDetailsCard
          transaction={makeTransaction({ transactionType: 'income' })}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('amount')).toHaveClass('text-transaction-income-label');
    expect(screen.getByText('+10.00 USD')).toHaveClass(
      'text-bt-primary',
      'font-semibold',
    );
  });

  it('renders trash mode metadata and icon for trashed transaction details', () => {
    render(
      <MemoryRouter>
        <TransactionDetailsCard
          transaction={makeTrashedTransaction({
            category: { id: 'cat-transfer', type: 'system', name: 'myAccount' },
            paymentMethod: { id: 'pm-system', type: 'system', name: 'cash' },
            account: { id: 'acc-system', type: 'system', name: 'savings' },
          })}
          mode="trash"
        />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText('trashedTransaction')).toBeInTheDocument();
    expect(screen.getByText('deletedAt')).toHaveClass('text-transaction-expense-label');
    expect(screen.getByText('purgeAt')).toHaveClass('text-transaction-expense-label');
    expect(screen.getByText(/1\/10\/2024, .*:00:00 PM/).parentElement).toHaveClass(
      'text-destructive',
    );
    expect(screen.getByText('myAccount')).toBeInTheDocument();
    expect(screen.getByText('cash')).toBeInTheDocument();
    expect(screen.getByText('savings')).toBeInTheDocument();
  });
});
