import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeTrashedTransaction } from '@test-utils/factories/transaction';
import type { TrashedTransactionDetails as ApiTrashedTransactionDetails } from '@transactions/api';

import { TrashedTransactionDetails as TrashedTransactionDetailsView } from './trashed-transaction-details';

const mocks = vi.hoisted(() => ({
  getTrashedTransaction: vi.fn(),
  restoreTransaction: vi.fn(),
  deleteTrashedTransaction: vi.fn(),
  navigate: vi.fn(),
  pushToast: vi.fn(),
  params: { transactionId: 'tx-1' },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@transactions/api', () => ({
  getTrashedTransaction: (...args: unknown[]) => mocks.getTrashedTransaction(...args),
  restoreTransaction: (...args: unknown[]) => mocks.restoreTransaction(...args),
  deleteTrashedTransaction: (...args: unknown[]) =>
    mocks.deleteTrashedTransaction(...args),
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
      onClose,
      confirmLabel,
      children,
    }: {
      isOpen: boolean;
      title: string;
      onConfirm: () => void;
      onClose: () => void;
      confirmLabel: string;
      children: ReactNode;
    }) =>
      isOpen ? (
        <div>
          <h2>{title}</h2>
          <div>{children}</div>
          <button type="button" onClick={onClose}>
            close
          </button>
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
    <div data-testid="trashed-transaction-details-card">{transaction.description}</div>
  ),
}));

const baseTransaction: ApiTrashedTransactionDetails = makeTrashedTransaction();

describe('TrashedTransactionDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mocks.getTrashedTransaction.mockReturnValueOnce(new Promise(() => {}));
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <TrashedTransactionDetailsView />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    mocks.getTrashedTransaction.mockRejectedValueOnce(new Error('Oops'));
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <TrashedTransactionDetailsView />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Oops')).toBeInTheDocument();
  });

  it('renders info that no trashed transaction was returned', async () => {
    mocks.getTrashedTransaction.mockResolvedValueOnce(null);
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <TrashedTransactionDetailsView />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('No transaction')).toBeInTheDocument();
  });

  it('renders trashed transaction details actions', async () => {
    mocks.getTrashedTransaction.mockResolvedValueOnce(baseTransaction);
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <TrashedTransactionDetailsView />
      </QueryClientProvider>,
    );

    expect(
      await screen.findByRole('button', { name: 'restoreTransaction' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'deleteTransactionPermanently' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('trashed-transaction-details-card')).toBeInTheDocument();
  });

  it('restores a trashed transaction after confirmation', async () => {
    mocks.getTrashedTransaction.mockResolvedValue(baseTransaction);
    mocks.restoreTransaction.mockResolvedValueOnce({
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
        <TrashedTransactionDetailsView />
      </QueryClientProvider>,
    );

    await user.click(await screen.findByRole('button', { name: 'restoreTransaction' }));
    await screen.findByRole('heading', { name: 'restoreTransactionModalTitle' });
    await user.click(screen.getByTestId('transaction-action-modal-confirm'));

    await waitFor(() => {
      expect(mocks.restoreTransaction).toHaveBeenCalledWith('tx-1');
    });
    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith('/transactions/tx-1');
    });
    await waitFor(() => {
      expect(mocks.pushToast).toHaveBeenCalledWith({
        variant: 'success',
        title: 'transactionRestored',
      });
    });
  });

  it('closes restore modal without confirming', async () => {
    mocks.getTrashedTransaction.mockResolvedValueOnce(baseTransaction);
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={client}>
        <TrashedTransactionDetailsView />
      </QueryClientProvider>,
    );

    await user.click(await screen.findByRole('button', { name: 'restoreTransaction' }));
    expect(
      screen.getByRole('heading', { name: 'restoreTransactionModalTitle' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'close' }));

    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'restoreTransactionModalTitle' }),
      ).not.toBeInTheDocument(),
    );
  });

  it('navigates back to trash list after clicking back button', async () => {
    mocks.getTrashedTransaction.mockResolvedValueOnce(baseTransaction);
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={client}>
        <TrashedTransactionDetailsView />
      </QueryClientProvider>,
    );

    await user.click(await screen.findByRole('button', { name: 'backToTrash' }));

    expect(mocks.navigate).toHaveBeenCalledWith('/transactions/trash');
  });

  it('shows an error toast when restore fails', async () => {
    mocks.getTrashedTransaction.mockResolvedValueOnce({
      ...baseTransaction,
      refId: 'tx-2',
      category: { id: 'cat-transfer', type: 'system', name: 'myAccount' },
    });
    mocks.restoreTransaction.mockRejectedValueOnce(new Error('restore boom'));
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={client}>
        <TrashedTransactionDetailsView />
      </QueryClientProvider>,
    );

    await user.click(await screen.findByRole('button', { name: 'restoreTransaction' }));
    expect(screen.getByText('restoreTransferReferenceHint')).toBeInTheDocument();
    await user.click(screen.getByTestId('transaction-action-modal-confirm'));

    await waitFor(() =>
      expect(mocks.pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'transactionRestoreFailed',
        message: 'restore boom',
      }),
    );
  });

  it('permanently deletes a trashed transaction after confirmation', async () => {
    mocks.getTrashedTransaction.mockResolvedValueOnce({
      ...baseTransaction,
      refId: 'tx-2',
      category: { id: 'cat-exchange', type: 'system', name: 'exchange' },
    });
    mocks.deleteTrashedTransaction.mockResolvedValueOnce({
      acknowledged: true,
      deletedCount: 1,
    });
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const removeQueriesSpy = vi.spyOn(client, 'removeQueries');
    const user = userEvent.setup();

    const { unmount } = render(
      <QueryClientProvider client={client}>
        <TrashedTransactionDetailsView />
      </QueryClientProvider>,
    );

    await user.click(
      await screen.findByRole('button', { name: 'deleteTransactionPermanently' }),
    );
    expect(screen.getByText('permanentDeleteExchangeReferenceHint')).toBeInTheDocument();
    await user.click(screen.getByTestId('transaction-action-modal-confirm'));

    await waitFor(() =>
      expect(mocks.pushToast).toHaveBeenCalledWith({
        variant: 'success',
        title: 'transactionDeletedPermanently',
      }),
    );
    expect(mocks.navigate).toHaveBeenCalledWith('/transactions/trash');

    unmount();

    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['trashed-transaction', 'tx-1'],
      exact: true,
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['trashed-transaction', 'tx-2'],
      exact: true,
    });
  });

  it('shows an error toast when permanent delete fails and allows closing the modal', async () => {
    mocks.getTrashedTransaction.mockResolvedValueOnce(baseTransaction);
    mocks.deleteTrashedTransaction.mockRejectedValueOnce(new Error('delete boom'));
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={client}>
        <TrashedTransactionDetailsView />
      </QueryClientProvider>,
    );

    await user.click(
      await screen.findByRole('button', { name: 'deleteTransactionPermanently' }),
    );
    expect(
      screen.getByRole('heading', { name: 'permanentDeleteModalTitle' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'close' }));

    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'permanentDeleteModalTitle' }),
      ).not.toBeInTheDocument(),
    );

    await user.click(
      await screen.findByRole('button', { name: 'deleteTransactionPermanently' }),
    );
    await user.click(screen.getByTestId('transaction-action-modal-confirm'));

    await waitFor(() =>
      expect(mocks.pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'transactionPermanentDeleteFailed',
        message: 'delete boom',
      }),
    );
  });
});
