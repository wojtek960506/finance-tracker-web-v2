import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { CreateTransferTransaction } from './create-transfer-transaction';

const mocks = vi.hoisted(() => ({
  createTransferTransaction: vi.fn(),
  normalizeApiError: vi.fn(),
  navigate: vi.fn(),
  pushToast: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock('@transactions/api', () => ({
  createTransferTransaction: (...args: unknown[]) =>
    mocks.createTransferTransaction(...args),
}));

vi.mock('@shared/api/api-error', () => ({
  normalizeApiError: (error: unknown) => mocks.normalizeApiError(error),
}));

vi.mock('@store/toast-store', () => ({
  useToastStore: (selector: (state: { pushToast: typeof mocks.pushToast }) => unknown) =>
    selector({ pushToast: mocks.pushToast }),
}));

vi.mock('@transactions/components/transaction-forms', () => ({
  getDefaultTransferTransactionFormValues: () => ({
    date: '2024-01-03',
    additionalDescription: '',
    amount: '',
    currency: '',
    paymentMethodId: '',
    accountExpenseId: '',
    accountIncomeId: '',
  }),
  toOptionalTrimmedString: (value: string) => value.trim() || undefined,
  TransferTransactionForm: ({
    onSubmit,
    onCancel,
  }: {
    onSubmit: (values: unknown) => Promise<void>;
    onCancel: () => void;
  }) => (
    <div>
      <button
        type="button"
        onClick={() =>
          void onSubmit({
            date: '2024-01-03',
            additionalDescription: 'Move funds',
            amount: '10',
            currency: 'USD',
            paymentMethodId: 'pm-1',
            accountExpenseId: 'acc-1',
            accountIncomeId: 'acc-2',
          })
        }
      >
        submit
      </button>
      <button type="button" onClick={onCancel}>
        cancel
      </button>
    </div>
  ),
}));

describe('CreateTransferTransaction', () => {
  it('creates a transfer transaction and navigates back to the list', async () => {
    const user = userEvent.setup();
    const client = createTestQueryClient();
    const invalidateQueriesSpy = vi.spyOn(client, 'invalidateQueries');
    mocks.createTransferTransaction.mockResolvedValueOnce([
      { id: 'tx-1' },
      { id: 'tx-2' },
    ]);

    render(
      <QueryClientProvider client={client}>
        <CreateTransferTransaction />
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'submit' }));

    await waitFor(() =>
      expect(mocks.createTransferTransaction).toHaveBeenCalledWith({
        date: '2024-01-03',
        additionalDescription: 'Move funds',
        amount: 10,
        currency: 'USD',
        paymentMethodId: 'pm-1',
        accountExpenseId: 'acc-1',
        accountIncomeId: 'acc-2',
      }),
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['transactions'] });
    expect(mocks.pushToast).toHaveBeenCalledWith({
      variant: 'success',
      title: 'transactionCreated',
    });
    expect(mocks.navigate).toHaveBeenCalledWith('/transactions');
  });

  it('shows an error toast when creating fails and handles cancel', async () => {
    const user = userEvent.setup();
    const client = createTestQueryClient();
    const error = new Error('boom');
    mocks.createTransferTransaction.mockRejectedValueOnce(error);
    mocks.normalizeApiError.mockReturnValueOnce({ message: 'Create failed' });

    render(
      <QueryClientProvider client={client}>
        <CreateTransferTransaction />
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'submit' }));

    await waitFor(() =>
      expect(mocks.pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'transactionCreateFailed',
        message: 'Create failed',
      }),
    );

    await user.click(screen.getByRole('button', { name: 'cancel' }));
    expect(mocks.navigate).toHaveBeenCalledWith('/transactions/new');
  });
});
