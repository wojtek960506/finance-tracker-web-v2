import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeTransaction } from '@test-utils/factories/transaction';
import type { TransactionsResponse } from '@transactions/api';

import { TransactionsList } from './transactions-list';

const mocks = vi.hoisted(() => ({
  getTransactions: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@transactions/api', () => ({
  getTransactions: (...args: unknown[]) => mocks.getTransactions(...args),
}));

vi.mock('@shared/ui', () => ({
  Button: ({ children }: { children: ReactNode }) => (
    <button type="button">{children}</button>
  ),
}));

vi.mock('./transaction-preview', () => ({
  TransactionPreview: ({ transaction }: { transaction: { description: string } }) => (
    <li>{transaction.description}</li>
  ),
}));

const emptyResponse: TransactionsResponse = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  items: [],
};

describe('TransactionsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mocks.getTransactions.mockReturnValueOnce(new Promise(() => {}));
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <TransactionsList />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    mocks.getTransactions.mockRejectedValueOnce(new Error('Boom'));
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <TransactionsList />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Boom')).toBeInTheDocument();
  });

  it('renders empty state when no items are returned', async () => {
    mocks.getTransactions.mockResolvedValueOnce(emptyResponse);
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <TransactionsList />
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText(
        'There are no transactions - TODO add button to create one',
      ),
    ).toBeInTheDocument();
  });

  it('renders a list of transactions', async () => {
    const response: TransactionsResponse = {
      ...emptyResponse,
      total: 2,
      totalPages: 1,
      items: [
        makeTransaction({
          id: 'tx-1',
          date: '2024-01-03',
          description: 'Groceries',
          amount: 10,
        }),
        makeTransaction({
          id: 'tx-2',
          ownerId: 'owner-2',
          createdAt: '2024-02-01',
          updatedAt: '2024-02-02',
          sourceIndex: 'source-2',
          date: '2024-02-03',
          description: 'Salary',
          amount: 200,
          transactionType: 'income',
          category: { id: 'cat-2', type: 'category', name: 'Job' },
          paymentMethod: { id: 'pm-2', type: 'paymentMethod', name: 'Bank' },
          account: { id: 'acc-2', type: 'account', name: 'Savings' },
        }),
      ],
    };

    mocks.getTransactions.mockResolvedValueOnce(response);
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <TransactionsList />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'newTransaction' })).toBeInTheDocument();
  });
});
