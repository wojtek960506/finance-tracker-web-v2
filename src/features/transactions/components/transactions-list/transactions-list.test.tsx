import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeTransaction } from '@test-utils/factories/transaction';
import type { TransactionsResponse } from '@transactions/api';

import { TransactionsList } from './transactions-list';

const mocks = vi.hoisted(() => ({
  getTransactions: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@transactions/api', () => ({
  getTransactions: (...args: unknown[]) => mocks.getTransactions(...args),
}));

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mocks.navigate };
});

vi.mock('@shared/ui', () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) => (
    <button type="button" {...props}>
      {children}
    </button>
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
        <MemoryRouter>
          <TransactionsList />
        </MemoryRouter>
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
        <MemoryRouter>
          <TransactionsList />
        </MemoryRouter>
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
        <MemoryRouter>
          <TransactionsList />
        </MemoryRouter>
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
        <MemoryRouter>
          <TransactionsList />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'newTransaction' })).toBeInTheDocument();
  });

  it('navigates to the create transaction page', async () => {
    const user = userEvent.setup();
    const response: TransactionsResponse = {
      ...emptyResponse,
      total: 1,
      totalPages: 1,
      items: [makeTransaction({ description: 'Groceries' })],
    };
    mocks.getTransactions.mockResolvedValueOnce(response);
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <TransactionsList />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.click(await screen.findByRole('button', { name: 'newTransaction' }));

    expect(mocks.navigate).toHaveBeenCalledWith('/transactions/new');
  });

  it('switches to a different transactions page', async () => {
    const user = userEvent.setup();
    mocks.getTransactions.mockImplementation((page?: number) =>
      Promise.resolve(
        page === 2
          ? {
              ...emptyResponse,
              page: 2,
              total: 40,
              totalPages: 2,
              items: [makeTransaction({ id: 'tx-2', description: 'Page 2 transaction' })],
            }
          : {
              ...emptyResponse,
              page: 1,
              total: 40,
              totalPages: 2,
              items: [makeTransaction({ id: 'tx-1', description: 'Page 1 transaction' })],
            },
      ),
    );
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <TransactionsList />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Page 1 transaction')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '2' }));

    expect(await screen.findByText('Page 2 transaction')).toBeInTheDocument();
    expect(mocks.getTransactions).toHaveBeenCalledWith(1);
    expect(mocks.getTransactions).toHaveBeenCalledWith(2);
  });

  it('renders compact pagination with ellipses around current page', async () => {
    mocks.getTransactions.mockResolvedValueOnce({
      ...emptyResponse,
      page: 27,
      total: 1230,
      totalPages: 123,
      items: [makeTransaction({ id: 'tx-27', description: 'Paged transaction' })],
    });
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <TransactionsList />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Paged transaction')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '25' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '26' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '27' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: '28' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '29' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '123' })).toBeInTheDocument();
    expect(screen.getAllByText('...')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'previousPage' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'nextPage' })).toBeInTheDocument();
  });
});
