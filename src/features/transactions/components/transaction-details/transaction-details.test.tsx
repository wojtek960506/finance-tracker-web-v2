import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { ComponentProps, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Transaction } from '@transactions/api';

import { TransactionDetails } from './transaction-details';

const mocks = vi.hoisted(() => ({
  getTransaction: vi.fn(),
  language: 'en-US',
  params: { transactionId: 'tx-1' },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@shared/hooks', () => ({
  useLanguage: () => ({ language: mocks.language }),
}));

vi.mock('@transactions/api', () => ({
  getTransaction: (...args: unknown[]) => mocks.getTransaction(...args),
}));

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useParams: () => mocks.params };
});

vi.mock('@ui', () => ({
  Button: ({
    children,
    ...props
  }: ComponentProps<'button'> & { children: ReactNode }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  HoverLink: ({ to, children }: { to: string; children: ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('./additional-details', () => ({
  AdditionalDetails: () => <div data-testid="additional-details" />,
}));

const baseTransaction: Transaction = {
  id: 'tx-1',
  ownerId: 'owner-1',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-02',
  sourceIndex: 'source-1',
  date: '2024-01-03',
  description: 'Test transaction',
  amount: 10,
  currency: 'USD',
  transactionType: 'expense',
  category: { id: 'cat-1', type: 'category', name: 'Food' },
  paymentMethod: { id: 'pm-1', type: 'paymentMethod', name: 'Card' },
  account: { id: 'acc-1', type: 'account', name: 'Main' },
};

describe('TransactionDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mocks.getTransaction.mockReturnValueOnce(new Promise(() => {}));
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <TransactionDetails />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    mocks.getTransaction.mockRejectedValueOnce(new Error('Oops'));
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <TransactionDetails />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Oops')).toBeInTheDocument();
  });

  it('renders info that no transaction was returned', async () => {
    mocks.getTransaction.mockRejectedValueOnce(undefined);
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <TransactionDetails />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('No transaction')).toBeInTheDocument();
  });

  it('renders transaction details', async () => {
    mocks.getTransaction.mockResolvedValueOnce(baseTransaction);
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <TransactionDetails />
      </QueryClientProvider>,
    );

    expect(
      await screen.findByRole('button', { name: 'updateTransaction' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'deleteTransaction' })).toBeInTheDocument();
    expect(screen.getByText('Test transaction')).toBeInTheDocument();

    const formattedDate = new Date(baseTransaction.date).toLocaleDateString(
      mocks.language,
    );
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
    expect(screen.getByText('10.00 USD')).toBeInTheDocument();
    expect(screen.getByText('expense')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Card')).toBeInTheDocument();
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByTestId('additional-details')).toBeInTheDocument();
  });
});
