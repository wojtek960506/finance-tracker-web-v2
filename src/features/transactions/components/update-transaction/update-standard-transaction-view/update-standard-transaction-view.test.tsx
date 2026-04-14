import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';
import { makeTransaction } from '@test-utils/factories/transaction';

import { UpdateStandardTransactionView } from './update-standard-transaction-view';

const mocks = vi.hoisted(() => ({
  updateStandardTransaction: vi.fn(),
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

vi.mock('@transactions/api', async () => {
  const actual =
    await vi.importActual<typeof import('@transactions/api')>('@transactions/api');
  return {
    ...actual,
    updateStandardTransaction: (...args: unknown[]) =>
      mocks.updateStandardTransaction(...args),
  };
});

vi.mock('@shared/api/api-error', () => ({
  normalizeApiError: (error: unknown) => mocks.normalizeApiError(error),
}));

vi.mock('@store/toast-store', () => ({
  useToastStore: (selector: (state: { pushToast: typeof mocks.pushToast }) => unknown) =>
    selector({ pushToast: mocks.pushToast }),
}));

vi.mock('@transactions/components/transaction-forms', async () => {
  const actual = await vi.importActual<
    typeof import('@transactions/components/transaction-forms')
  >('@transactions/components/transaction-forms');

  return {
    ...actual,
    StandardTransactionForm: ({
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
              description: 'Groceries',
              amount: '10',
              currency: 'USD',
              categoryId: 'cat-1',
              paymentMethodId: 'pm-1',
              accountId: 'acc-1',
              transactionType: 'expense',
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
  };
});

describe('UpdateStandardTransactionView', () => {
  it('updates a standard transaction', async () => {
    const user = userEvent.setup();
    const client = createTestQueryClient();
    const invalidateQueriesSpy = vi.spyOn(client, 'invalidateQueries');
    mocks.updateStandardTransaction.mockResolvedValueOnce({ id: 'tx-1' });

    render(
      <QueryClientProvider client={client}>
        <UpdateStandardTransactionView transaction={makeTransaction()} />
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'submit' }));

    await waitFor(() =>
      expect(mocks.updateStandardTransaction).toHaveBeenCalledWith('tx-1', {
        date: '2024-01-03',
        description: 'Groceries',
        amount: 10,
        currency: 'USD',
        categoryId: 'cat-1',
        paymentMethodId: 'pm-1',
        accountId: 'acc-1',
        transactionType: 'expense',
      }),
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['transactions'] });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['transaction', 'tx-1'],
      exact: true,
    });
    expect(mocks.pushToast).toHaveBeenCalledWith({
      variant: 'success',
      title: 'transactionUpdated',
    });
    expect(mocks.navigate).toHaveBeenCalledWith('/transactions/tx-1');
  });

  it('shows an error toast and handles cancel', async () => {
    const user = userEvent.setup();
    const client = createTestQueryClient();
    const error = new Error('boom');
    mocks.updateStandardTransaction.mockRejectedValueOnce(error);
    mocks.normalizeApiError.mockReturnValueOnce({ message: 'Update failed' });

    render(
      <QueryClientProvider client={client}>
        <UpdateStandardTransactionView transaction={makeTransaction()} />
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'submit' }));

    await waitFor(() =>
      expect(mocks.pushToast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'transactionUpdateFailed',
        message: 'Update failed',
      }),
    );

    await user.click(screen.getByRole('button', { name: 'cancel' }));
    expect(mocks.navigate).toHaveBeenCalledWith('/transactions/tx-1');
  });
});
