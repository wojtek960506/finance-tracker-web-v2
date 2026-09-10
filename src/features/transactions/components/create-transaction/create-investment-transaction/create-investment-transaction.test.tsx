import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';
import { makeTransaction } from '@test-utils/factories/transaction';

import { CreateInvestmentTransaction } from './create-investment-transaction';

const mocks = vi.hoisted(() => ({
  createInvestmentTransaction: vi.fn(),
  location: { state: undefined as { returnTo: string } | undefined },
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

vi.mock('@transactions/api', () => ({
  createInvestmentTransaction: (...args: unknown[]) =>
    mocks.createInvestmentTransaction(...args),
}));

vi.mock('@shared/api/api-error', () => ({
  normalizeApiError: (error: unknown) => mocks.normalizeApiError(error),
}));

vi.mock('@store/toast-store', () => ({
  useToastStore: (selector: (state: { pushToast: typeof mocks.pushToast }) => unknown) =>
    selector({ pushToast: mocks.pushToast }),
}));

vi.mock('@transactions/components/transaction-forms', () => ({
  getDefaultInvestmentTransactionFormValues: () => ({
    date: '2026-09-10',
    description: 'Buy Apple stock',
    amount: '1000',
    currency: 'USD',
    paymentMethodId: '',
    accountId: '',
    operationKind: 'buy',
    instrumentId: 'inst-1',
    note: '',
  }),
  normalizeInvestmentTransactionFormValues: (values: any) => ({
    date: values.date,
    description: values.description.trim(),
    amount: Number(values.amount),
    currency: values.currency,
    paymentMethodId: values.paymentMethodId || undefined,
    accountId: values.accountId || undefined,
    investment: {
      operationKind: values.operationKind,
      instrumentId: values.instrumentId,
      note: values.note ? values.note.trim() : undefined,
    },
  }),
  InvestmentTransactionForm: ({
    onSubmit,
    onCancel,
    defaultValues,
  }: {
    onSubmit: (values: any) => void;
    onCancel: () => void;
    defaultValues: any;
  }) => (
    <div>
      <button
        type="button"
        onClick={() =>
          onSubmit({
            ...defaultValues,
            description: 'Buy Apple stock',
            amount: '1000',
            currency: 'USD',
            operationKind: 'buy',
            instrumentId: 'inst-1',
          })
        }
      >
        Submit Investment
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </div>
  ),
}));

describe('CreateInvestmentTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.location.state = undefined;
    mocks.normalizeApiError.mockReturnValue({ message: 'Error message' });
  });

  it('creates investment transaction and navigates', async () => {
    const queryClient = createTestQueryClient();
    const createdTx = makeTransaction({ kind: 'investment' });
    mocks.createInvestmentTransaction.mockResolvedValue(createdTx);
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateInvestmentTransaction />
      </QueryClientProvider>,
    );

    const submitBtn = screen.getByRole('button', { name: /submit investment/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mocks.createInvestmentTransaction).toHaveBeenCalledWith({
        date: '2026-09-10',
        description: 'Buy Apple stock',
        amount: 1000,
        currency: 'USD',
        paymentMethodId: undefined,
        accountId: undefined,
        investment: {
          operationKind: 'buy',
          instrumentId: 'inst-1',
          note: undefined,
        },
      });
      expect(mocks.pushToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'success',
          title: 'transactionCreated',
        }),
      );
      expect(mocks.navigate).toHaveBeenCalledWith('/transactions');
    });
  });

  it('shows error toast on creation failure', async () => {
    const queryClient = createTestQueryClient();
    mocks.createInvestmentTransaction.mockRejectedValue(new Error('Failed'));
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateInvestmentTransaction />
      </QueryClientProvider>,
    );

    const submitBtn = screen.getByRole('button', { name: /submit investment/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mocks.pushToast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'error',
          title: 'transactionCreateFailed',
        }),
      );
    });
  });

  it('navigates back on cancel', async () => {
    const queryClient = createTestQueryClient();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <CreateInvestmentTransaction />
      </QueryClientProvider>,
    );

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelBtn);

    expect(mocks.navigate).toHaveBeenCalledWith('/transactions/new', expect.anything());
  });
});
