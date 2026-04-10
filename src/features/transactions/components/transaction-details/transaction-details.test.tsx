import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeTransaction } from '@test-utils/factories/transaction';
import type { TransactionDetails } from '@transactions/api';

import { TransactionDetails } from './transaction-details';

const mocks = vi.hoisted(() => ({
  getTransaction: vi.fn(),
  moveTransactionToTrash: vi.fn(),
  language: 'en-US',
  navigate: vi.fn(),
  pushToast: vi.fn(),
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
  moveTransactionToTrash: (...args: unknown[]) => mocks.moveTransactionToTrash(...args),
}));

vi.mock('@store/toast-store', () => ({
  useToastStore: (selector: (state: { pushToast: typeof mocks.pushToast }) => unknown) =>
    selector({ pushToast: mocks.pushToast }),
}));

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
    useParams: () => mocks.params,
  };
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
}));

vi.mock('@transactions/components/shared', async () => {
  const actual = await vi.importActual<typeof import('@transactions/components/shared')>(
    '@transactions/components/shared',
  );
  return {
    ...actual,
    TransactionActionModal: ({
      isOpen,
      title,
      onConfirm,
      confirmLabel,
      children,
    }: {
      isOpen: boolean;
      title: string;
      onConfirm: () => void;
      confirmLabel: string;
      children: ReactNode;
    }) =>
      isOpen ? (
        <div>
          <h2>{title}</h2>
          <div>{children}</div>
          <button
            type="button"
            data-testid="transaction-action-modal-confirm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      ) : null,
  };
});

vi.mock('./transaction-details-card', () => ({
  TransactionDetailsCard: ({ transaction }: { transaction: { description: string } }) => (
    <div data-testid="transaction-details-card">{transaction.description}</div>
  ),
}));

const baseTransaction: TransactionDetails = makeTransaction();

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
    expect(screen.getByRole('button', { name: 'moveToTrash' })).toBeInTheDocument();
    expect(screen.getByText('Test transaction')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-details-card')).toBeInTheDocument();
  });

  it('navigates to update route after clicking update button', async () => {
    mocks.getTransaction.mockResolvedValueOnce(baseTransaction);
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={client}>
        <TransactionDetails />
      </QueryClientProvider>,
    );

    await user.click(await screen.findByRole('button', { name: 'updateTransaction' }));

    expect(mocks.navigate).toHaveBeenCalledWith('/transactions/tx-1/edit');
  });

  it('moves transaction to trash after confirmation', async () => {
    mocks.getTransaction.mockResolvedValue(baseTransaction);
    mocks.moveTransactionToTrash.mockResolvedValueOnce({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
    });
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={client}>
        <TransactionDetails />
      </QueryClientProvider>,
    );

    await user.click(await screen.findByRole('button', { name: 'moveToTrash' }));
    await screen.findByRole('heading', { name: 'moveToTrashModalTitle' });
    await user.click(screen.getByTestId('transaction-action-modal-confirm'));

    await waitFor(() => {
      expect(mocks.moveTransactionToTrash).toHaveBeenCalledWith('tx-1');
    });
    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith('/transactions');
    });
    await waitFor(() => {
      expect(mocks.pushToast).toHaveBeenCalledWith({
        variant: 'success',
        title: 'transactionMovedToTrash',
      });
    });
  });
});
