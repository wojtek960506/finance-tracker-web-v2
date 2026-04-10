import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeTrashedTransaction } from '@test-utils/factories/transaction';
import type { TrashedTransactionsResponse } from '@transactions/api';

import { TrashedTransactionsList } from './trashed-transactions-list';

const mocks = vi.hoisted(() => ({
  getTrashedTransactions: vi.fn(),
  emptyTrash: vi.fn(),
  pushToast: vi.fn(),
  language: 'en-US',
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@shared/hooks', () => ({
  useLanguage: () => ({ language: mocks.language }),
}));

vi.mock('@transactions/api', () => ({
  getTrashedTransactions: (...args: unknown[]) => mocks.getTrashedTransactions(...args),
  emptyTrash: (...args: unknown[]) => mocks.emptyTrash(...args),
}));

vi.mock('@store/toast-store', () => ({
  useToastStore: (selector: (state: { pushToast: typeof mocks.pushToast }) => unknown) =>
    selector({ pushToast: mocks.pushToast }),
}));

vi.mock('@ui', () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  Label: ({ children }: { children: ReactNode }) => <label>{children}</label>,
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
      children,
      onConfirm,
      onClose,
      confirmLabel,
    }: {
      isOpen: boolean;
      title: string;
      children: ReactNode;
      onConfirm: () => void;
      onClose: () => void;
      confirmLabel: string;
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

vi.mock('./transaction-preview', () => ({
  TransactionPreview: ({ transaction }: { transaction: { description: string } }) => (
    <li>{transaction.description}</li>
  ),
}));

const emptyResponse: TrashedTransactionsResponse = {
  page: 1,
  limit: 30,
  total: 0,
  totalPages: 0,
  items: [],
};

describe('TrashedTransactionsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when trash is empty', async () => {
    mocks.getTrashedTransactions.mockResolvedValueOnce(emptyResponse);
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <TrashedTransactionsList />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('trashIsEmpty')).toBeInTheDocument();
  });

  it('renders error state when trash query fails', async () => {
    mocks.getTrashedTransactions.mockRejectedValueOnce(new Error('Oops'));
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <TrashedTransactionsList />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Oops')).toBeInTheDocument();
  });

  it('renders empty state when trash query returns no data', async () => {
    mocks.getTrashedTransactions.mockResolvedValue(null);
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <TrashedTransactionsList />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText('trashIsEmpty')).toBeInTheDocument();
  });

  it('empties trash after typed confirmation', async () => {
    const user = userEvent.setup();
    mocks.getTrashedTransactions.mockResolvedValue({
      ...emptyResponse,
      total: 1,
      totalPages: 1,
      items: [makeTrashedTransaction()],
    });
    mocks.emptyTrash.mockResolvedValueOnce({ acknowledged: true, deletedCount: 1 });
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <TrashedTransactionsList />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.click(await screen.findByRole('button', { name: 'emptyTrash' }));
    await screen.findByRole('heading', { name: 'emptyTrashModalTitle' });
    await user.type(screen.getByPlaceholderText('DELETE'), 'DELETE');
    await user.click(screen.getByTestId('transaction-action-modal-confirm'));

    await waitFor(() => {
      expect(mocks.emptyTrash).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mocks.pushToast).toHaveBeenCalledWith({
        variant: 'success',
        title: 'trashEmptied',
      });
    });
  });

  it('closes the empty trash modal without confirming', async () => {
    const user = userEvent.setup();
    mocks.getTrashedTransactions.mockResolvedValueOnce({
      ...emptyResponse,
      total: 1,
      totalPages: 1,
      items: [makeTrashedTransaction()],
    });
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <TrashedTransactionsList />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.click(await screen.findByRole('button', { name: 'emptyTrash' }));
    expect(
      screen.getByRole('heading', { name: 'emptyTrashModalTitle' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'close' }));

    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'emptyTrashModalTitle' }),
      ).not.toBeInTheDocument(),
    );
  });

  it('shows an error toast when empty trash fails', async () => {
    const user = userEvent.setup();
    mocks.getTrashedTransactions.mockResolvedValueOnce({
      ...emptyResponse,
      total: 1,
      totalPages: 1,
      items: [makeTrashedTransaction()],
    });
    mocks.emptyTrash.mockRejectedValueOnce(new Error('empty failed'));
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <TrashedTransactionsList />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.click(await screen.findByRole('button', { name: 'emptyTrash' }));
    await user.type(screen.getByPlaceholderText('DELETE'), 'DELETE');
    await user.click(screen.getByTestId('transaction-action-modal-confirm'));

    await waitFor(() =>
      expect(mocks.pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'emptyTrashFailed',
        message: 'empty failed',
      }),
    );
  });
});
