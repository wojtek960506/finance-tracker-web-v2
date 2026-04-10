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

vi.mock('../transaction-action-modal', () => ({
  TransactionActionModal: ({
    isOpen,
    title,
    children,
    onConfirm,
    confirmLabel,
  }: {
    isOpen: boolean;
    title: string;
    children: ReactNode;
    onConfirm: () => void;
    confirmLabel: string;
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
}));

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
});
