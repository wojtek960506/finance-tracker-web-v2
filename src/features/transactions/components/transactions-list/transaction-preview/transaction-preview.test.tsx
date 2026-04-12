import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import {
  makeTransaction,
  makeTrashedTransaction,
} from '@test-utils/factories/transaction';
import type { Transaction, TrashedTransaction } from '@transactions/api';
import { EXCHANGE_CATEGORY, TRANSFER_CATEGORY } from '@transactions/consts';

import { TransactionPreview } from './transaction-preview';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@shared/hooks', () => ({
  useLanguage: () => ({ language: 'en-US' }),
}));

vi.mock('@ui', () => ({
  ButtonLink: ({
    to,
    children,
    className,
  }: {
    to: string;
    children: ReactNode;
    className?: string;
  }) => (
    <a href={to} data-to={to} className={className}>
      {children}
    </a>
  ),
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const baseTransaction: Transaction = makeTransaction();
const baseTrashedTransaction: TrashedTransaction = makeTrashedTransaction();

describe('TransactionPreview', () => {
  it('renders transaction info and details link', () => {
    render(
      <MemoryRouter>
        <TransactionPreview transaction={baseTransaction} />
      </MemoryRouter>,
    );

    const formattedDate = new Date(baseTransaction.date).toLocaleDateString('en-US');
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
    expect(screen.getByText('-10.00 USD')).toHaveClass('text-destructive');
    expect(screen.getByText('Test transaction')).toBeInTheDocument();

    expect(screen.getByTestId('transaction-kind-icon')).toHaveAttribute(
      'aria-label',
      'standardTransaction',
    );
    expect(screen.getByTestId('transaction-kind-icon')).toHaveClass(
      'border',
      'border-fg/50',
    );
    expect(screen.getByTestId('transaction-preview-link')).toHaveAttribute(
      'href',
      '/transactions/tx-1',
    );
  });

  it('supports custom details path and metadata', () => {
    render(
      <MemoryRouter>
        <TransactionPreview
          transaction={baseTrashedTransaction}
          detailsPathPrefix="/transactions/trash"
          metadata={<span>deleted meta</span>}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('deleted meta')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-preview-link')).toHaveAttribute(
      'href',
      '/transactions/trash/tx-1',
    );
  });

  it('renders income amounts with primary styling', () => {
    render(
      <MemoryRouter>
        <TransactionPreview
          transaction={makeTransaction({ transactionType: 'income' })}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('+10.00 USD')).toHaveClass('text-bt-primary');
  });

  it('renders transfer icon marker in preview footer', () => {
    render(
      <MemoryRouter>
        <TransactionPreview
          transaction={makeTransaction({
            category: { id: 'cat-1', type: 'system', name: TRANSFER_CATEGORY },
          })}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('transaction-kind-icon')).toHaveAttribute(
      'aria-label',
      'transferTransaction',
    );
  });

  it('renders exchange icon marker in preview footer', () => {
    render(
      <MemoryRouter>
        <TransactionPreview
          transaction={makeTransaction({
            category: { id: 'cat-1', type: 'system', name: EXCHANGE_CATEGORY },
          })}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('transaction-kind-icon')).toHaveAttribute(
      'aria-label',
      'exchangeTransaction',
    );
  });

  it('keeps a user category with a reserved system name as a standard transaction', () => {
    render(
      <MemoryRouter>
        <TransactionPreview
          transaction={makeTransaction({
            category: { id: 'cat-1', type: 'user', name: TRANSFER_CATEGORY },
          })}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('transaction-kind-icon')).toHaveAttribute(
      'aria-label',
      'standardTransaction',
    );
  });
});
