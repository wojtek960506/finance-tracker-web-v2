import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { createExchangeTransaction } from './create-exchange-transaction';
import { createStandardTransaction } from './create-standard-transaction';
import { createTransferTransaction } from './create-transfer-transaction';
import { updateExchangeTransaction } from './update-exchange-transaction';
import { updateStandardTransaction } from './update-standard-transaction';
import { updateTransferTransaction } from './update-transfer-transaction';

vi.mock('@shared/api', () => ({
  api: { post: vi.fn(), put: vi.fn() },
}));

describe('transaction mutations api', () => {
  it('creates a standard transaction', async () => {
    const payload = {
      date: '2024-01-03',
      description: 'Groceries',
      amount: 10,
      currency: 'USD',
      categoryId: 'cat-1',
      paymentMethodId: 'pm-1',
      accountId: 'acc-1',
      transactionType: 'expense' as const,
    };
    const response = { id: 'tx-1' };
    vi.mocked(api.post).mockResolvedValueOnce({ data: response });

    const result = await createStandardTransaction(payload);

    expect(api.post).toHaveBeenCalledWith('/transactions/standard', payload);
    expect(result).toEqual(response);
  });

  it('creates a transfer transaction pair', async () => {
    const payload = {
      date: '2024-01-03',
      additionalDescription: 'Move funds',
      amount: 10,
      currency: 'USD',
      accountExpenseId: 'acc-1',
      accountIncomeId: 'acc-2',
      paymentMethodId: 'pm-1',
    };
    const response = [{ id: 'tx-1' }, { id: 'tx-2' }];
    vi.mocked(api.post).mockResolvedValueOnce({ data: response });

    const result = await createTransferTransaction(payload);

    expect(api.post).toHaveBeenCalledWith('/transactions/transfer', payload);
    expect(result).toEqual(response);
  });

  it('creates an exchange transaction pair', async () => {
    const payload = {
      date: '2024-01-03',
      additionalDescription: 'Exchange',
      amountExpense: 10,
      amountIncome: 8,
      currencyExpense: 'USD',
      currencyIncome: 'EUR',
      accountId: 'acc-1',
      paymentMethodId: 'pm-1',
    };
    const response = [{ id: 'tx-1' }, { id: 'tx-2' }];
    vi.mocked(api.post).mockResolvedValueOnce({ data: response });

    const result = await createExchangeTransaction(payload);

    expect(api.post).toHaveBeenCalledWith('/transactions/exchange', payload);
    expect(result).toEqual(response);
  });

  it('updates a standard transaction', async () => {
    const payload = {
      date: '2024-01-03',
      description: 'Groceries',
      amount: 10,
      currency: 'USD',
      categoryId: 'cat-1',
      paymentMethodId: 'pm-1',
      accountId: 'acc-1',
      transactionType: 'expense' as const,
    };
    const response = { id: 'tx-1' };
    vi.mocked(api.put).mockResolvedValueOnce({ data: response });

    const result = await updateStandardTransaction('tx-1', payload);

    expect(api.put).toHaveBeenCalledWith('/transactions/standard/tx-1', payload);
    expect(result).toEqual(response);
  });

  it('updates a transfer transaction pair', async () => {
    const payload = {
      date: '2024-01-03',
      additionalDescription: 'Move funds',
      amount: 10,
      currency: 'USD',
      accountExpenseId: 'acc-1',
      accountIncomeId: 'acc-2',
      paymentMethodId: 'pm-1',
    };
    const response = [{ id: 'tx-1' }, { id: 'tx-2' }];
    vi.mocked(api.put).mockResolvedValueOnce({ data: response });

    const result = await updateTransferTransaction('tx-1', payload);

    expect(api.put).toHaveBeenCalledWith('/transactions/transfer/tx-1', payload);
    expect(result).toEqual(response);
  });

  it('updates an exchange transaction pair', async () => {
    const payload = {
      date: '2024-01-03',
      additionalDescription: 'Exchange',
      amountExpense: 10,
      amountIncome: 8,
      currencyExpense: 'USD',
      currencyIncome: 'EUR',
      accountId: 'acc-1',
      paymentMethodId: 'pm-1',
    };
    const response = [{ id: 'tx-1' }, { id: 'tx-2' }];
    vi.mocked(api.put).mockResolvedValueOnce({ data: response });

    const result = await updateExchangeTransaction('tx-1', payload);

    expect(api.put).toHaveBeenCalledWith('/transactions/exchange/tx-1', payload);
    expect(result).toEqual(response);
  });
});
