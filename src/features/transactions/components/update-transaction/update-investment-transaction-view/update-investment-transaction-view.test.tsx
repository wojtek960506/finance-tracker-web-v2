import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';
import { makeTransaction } from '@test-utils/factories/transaction';

import { UpdateInvestmentTransactionView } from './update-investment-transaction-view';

const mocks = vi.hoisted(() => ({
  location: { state: undefined },
  updateInvestmentTransaction: vi.fn(),
  normalizeApiError: vi.fn(),
  navigate: vi.fn(),
  pushToast: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mocks.navigate,
  useLocation: () => mocks.location,
}));

vi.mock('@transactions/api', async () => {
  const actual =
    await vi.importActual<typeof import('@transactions/api')>('@transactions/api');
  return {
    ...actual,
    updateInvestmentTransaction: (...args: unknown[]) =>
      mocks.updateInvestmentTransaction(...args),
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
    InvestmentTransactionForm: ({
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
            onSubmit({
              date: '2026-09-10',
              description: 'Updated investment',
              amount: '2000',
              currency: 'USD',
              paymentMethodId: '',
              accountId: '',
              operationKind: 'buy',
              instrumentId: 'inst-1',
              note: '',
            })
          }
        >
          Submit
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    ),
  };
});

describe('UpdateInvestmentTransactionView', () => {
  it('updates investment transaction and navigates to details', async () => {
    const queryClient = createTestQueryClient();
    const transaction = makeTransaction({ id: 'tx-1', kind: 'investment' });
    mocks.updateInvestmentTransaction.mockResolvedValue({
      ...transaction,
      description: 'Updated investment',
      amount: 2000,
    });
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <UpdateInvestmentTransactionView transaction={transaction} />
      </QueryClientProvider>,
    );

    const submitBtn = screen.getByRole('button', { name: /submit/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mocks.updateInvestmentTransaction).toHaveBeenCalledWith(
        'tx-1',
        expect.objectContaining({
          date: '2026-09-10',
          description: 'Updated investment',
          amount: 2000,
          currency: 'USD',
          investment: {
            operationKind: 'buy',
            instrumentId: 'inst-1',
            note: undefined,
          },
        }),
      );
      expect(mocks.pushToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'success',
          title: 'transactionUpdated',
        }),
      );
      expect(mocks.navigate).toHaveBeenCalledWith(
        '/transactions/tx-1',
        expect.anything(),
      );
    });
  });

  it('shows error toast when update fails', async () => {
    const queryClient = createTestQueryClient();
    const transaction = makeTransaction({ id: 'tx-1', kind: 'investment' });
    mocks.updateInvestmentTransaction.mockRejectedValue(new Error('Update failed'));
    mocks.normalizeApiError.mockReturnValue({ message: 'Update failed' });
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <UpdateInvestmentTransactionView transaction={transaction} />
      </QueryClientProvider>,
    );

    const submitBtn = screen.getByRole('button', { name: /submit/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mocks.pushToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'error',
          title: 'transactionUpdateFailed',
        }),
      );
    });
  });

  it('navigates back to details on cancel', async () => {
    const queryClient = createTestQueryClient();
    const transaction = makeTransaction({ id: 'tx-1', kind: 'investment' });
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <UpdateInvestmentTransactionView transaction={transaction} />
      </QueryClientProvider>,
    );

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelBtn);

    expect(mocks.navigate).toHaveBeenCalledWith('/transactions/tx-1', expect.anything());
  });
});
