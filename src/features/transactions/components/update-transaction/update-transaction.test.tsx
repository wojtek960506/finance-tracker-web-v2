import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeTransaction } from '@test-utils/factories/transaction';
import type { Transaction } from '@transactions/api';

import { UpdateTransaction } from './update-transaction';

const mocks = vi.hoisted(() => ({
  getTransaction: vi.fn<(id: string) => Promise<Transaction | null>>(),
  standardForm: vi.fn(() => <div data-testid="standard-form" />),
  transferForm: vi.fn(() => <div data-testid="transfer-form" />),
  exchangeForm: vi.fn(() => <div data-testid="exchange-form" />),
}));

const getLastCallArgs = (mockFn: typeof mocks.standardForm) => {
  const lastCall = mockFn.mock.calls.at(-1);
  expect(lastCall).toBeDefined();

  return (lastCall as any)[0];
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@transactions/api', () => ({
  getTransaction: mocks.getTransaction as (id: string) => Promise<Transaction | null>,
}));

vi.mock('@transactions/components/transaction-forms', async () => {
  const actual = await vi.importActual<
    typeof import('@transactions/components/transaction-forms')
  >('@transactions/components/transaction-forms');

  return {
    ...actual,
    StandardTransactionForm: mocks.standardForm,
    TransferTransactionForm: mocks.transferForm,
    ExchangeTransactionForm: mocks.exchangeForm,
  };
});

const renderUpdateTransaction = (transactionId = 'tx-1') => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/transactions/${transactionId}/edit`]}>
        <Routes>
          <Route
            path="/transactions/:transactionId/edit"
            element={<UpdateTransaction />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('UpdateTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the standard transaction form with current transaction defaults', async () => {
    const transaction = makeTransaction();
    mocks.getTransaction.mockResolvedValueOnce(transaction);

    renderUpdateTransaction();

    expect(await screen.findByTestId('standard-form')).toBeInTheDocument();
    expect(mocks.standardForm).toHaveBeenCalled();

    const { defaultValues, mode } = getLastCallArgs(mocks.standardForm);
    expect(mode).toBe('update');
    expect(defaultValues).toEqual({
      date: '2024-01-03',
      description: 'Test transaction',
      amount: '10',
      currency: 'USD',
      categoryId: 'cat-1',
      paymentMethodId: 'pm-1',
      accountId: 'acc-1',
      transactionType: 'expense',
    });
  });

  it('does not load the referenced transaction for standard transactions', async () => {
    const transaction = makeTransaction({ refId: 'tx-ref' });
    mocks.getTransaction.mockResolvedValueOnce(transaction);

    renderUpdateTransaction();

    expect(await screen.findByTestId('standard-form')).toBeInTheDocument();
    await vi.waitFor(() => expect(mocks.getTransaction).toHaveBeenCalledTimes(1));
  });

  it('renders the transfer form with derived pair defaults', async () => {
    const incomeTransaction = makeTransaction({
      id: 'tx-income',
      refId: 'tx-expense',
      description: 'Checking --> Savings (Monthly move)',
      transactionType: 'income',
      category: { id: 'cat-transfer', type: 'system', name: 'myAccount' },
      account: { id: 'acc-income', name: 'Savings', type: 'user' },
      paymentMethod: { id: 'pm-transfer', name: 'Bank transfer', type: 'user' },
    });
    const expenseTransaction = makeTransaction({
      id: 'tx-expense',
      refId: 'tx-income',
      description: 'Checking --> Savings (Monthly move)',
      transactionType: 'expense',
      category: { id: 'cat-transfer', type: 'system', name: 'myAccount' },
      account: { id: 'acc-expense', name: 'Checking', type: 'user' },
      paymentMethod: { id: 'pm-transfer', name: 'Bank transfer', type: 'user' },
    });

    mocks.getTransaction
      .mockResolvedValueOnce(incomeTransaction)
      .mockResolvedValueOnce(expenseTransaction);

    renderUpdateTransaction('tx-income');

    expect(await screen.findByTestId('transfer-form')).toBeInTheDocument();
    expect(mocks.transferForm).toHaveBeenCalled();

    const { defaultValues, mode } = getLastCallArgs(
      mocks.transferForm as typeof mocks.standardForm,
    );
    expect(mode).toBe('update');
    expect(defaultValues).toEqual({
      date: '2024-01-03',
      additionalDescription: 'Monthly move',
      amount: '10',
      currency: 'USD',
      paymentMethodId: 'pm-transfer',
      accountExpenseId: 'acc-expense',
      accountIncomeId: 'acc-income',
    });
  });

  it('renders the exchange form with derived pair defaults', async () => {
    const incomeTransaction = makeTransaction({
      id: 'tx-income',
      refId: 'tx-expense',
      description: 'USD -> EUR (Vacation cash)',
      transactionType: 'income',
      amount: 8,
      currency: 'EUR',
      category: { id: 'cat-exchange', type: 'system', name: 'exchange' },
      account: { id: 'acc-exchange', name: 'Wallet', type: 'user' },
      paymentMethod: { id: 'pm-exchange', name: 'Cash', type: 'user' },
    });
    const expenseTransaction = makeTransaction({
      id: 'tx-expense',
      refId: 'tx-income',
      description: 'USD -> EUR (Vacation cash)',
      transactionType: 'expense',
      amount: 10,
      currency: 'USD',
      category: { id: 'cat-exchange', type: 'system', name: 'exchange' },
      account: { id: 'acc-exchange', name: 'Wallet', type: 'user' },
      paymentMethod: { id: 'pm-exchange', name: 'Cash', type: 'user' },
    });

    mocks.getTransaction
      .mockResolvedValueOnce(incomeTransaction)
      .mockResolvedValueOnce(expenseTransaction);

    renderUpdateTransaction('tx-income');

    expect(await screen.findByTestId('exchange-form')).toBeInTheDocument();
    expect(mocks.exchangeForm).toHaveBeenCalled();

    const { defaultValues, mode } = getLastCallArgs(
      mocks.exchangeForm as typeof mocks.standardForm,
    );
    expect(mode).toBe('update');
    expect(defaultValues).toEqual({
      date: '2024-01-03',
      additionalDescription: 'Vacation cash',
      amountExpense: '10',
      amountIncome: '8',
      currencyExpense: 'USD',
      currencyIncome: 'EUR',
      paymentMethodId: 'pm-exchange',
      accountId: 'acc-exchange',
    });
  });

  it('renders a transaction error', async () => {
    mocks.getTransaction.mockRejectedValueOnce(new Error('Transaction failed'));

    renderUpdateTransaction();

    expect(await screen.findByText('Transaction failed')).toBeInTheDocument();
  });

  it('renders a reference transaction error', async () => {
    mocks.getTransaction
      .mockResolvedValueOnce(
        makeTransaction({
          id: 'tx-income',
          refId: 'tx-expense',
          description: 'Checking --> Savings',
          transactionType: 'income',
          category: { id: 'cat-transfer', type: 'system', name: 'myAccount' },
        }),
      )
      .mockRejectedValueOnce(new Error('Reference failed'));

    renderUpdateTransaction();

    expect(await screen.findByText('Reference failed')).toBeInTheDocument();
  });

  it('renders a fallback when the transaction is missing', async () => {
    mocks.getTransaction.mockResolvedValueOnce(null);

    renderUpdateTransaction();

    expect(await screen.findByText('No transaction')).toBeInTheDocument();
  });

  it('renders a fallback when a paired transaction reference is missing', async () => {
    mocks.getTransaction
      .mockResolvedValueOnce(
        makeTransaction({
          id: 'tx-income',
          refId: 'tx-expense',
          description: 'Checking --> Savings',
          transactionType: 'income',
          category: { id: 'cat-transfer', type: 'system', name: 'myAccount' },
        }),
      )
      .mockResolvedValueOnce(null);

    renderUpdateTransaction();

    expect(await screen.findByText('No transaction')).toBeInTheDocument();
  });
});
