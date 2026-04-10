import type { Transaction, TrashedTransaction } from '@transactions/api';

export const makeTransaction = (overrides: Partial<Transaction> = {}): Transaction => {
  const base: Transaction = {
    id: 'tx-1',
    ownerId: 'owner-1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-02',
    sourceIndex: 'source-1',
    date: '2024-01-03',
    description: 'Test transaction',
    amount: 10,
    currency: 'USD',
    transactionType: 'expense',
    refId: undefined,
    currencies: undefined,
    exchangeRate: undefined,
    category: { id: 'cat-1', type: 'category', name: 'Food' },
    paymentMethod: { id: 'pm-1', type: 'paymentMethod', name: 'Card' },
    account: { id: 'acc-1', type: 'account', name: 'Main' },
  };

  return {
    ...base,
    ...overrides,
    category: { ...base.category, ...overrides.category },
    paymentMethod: { ...base.paymentMethod, ...overrides.paymentMethod },
    account: { ...base.account, ...overrides.account },
  };
};

export const makeTrashedTransaction = (
  overrides: Partial<TrashedTransaction> = {},
): TrashedTransaction => {
  const base: TrashedTransaction = {
    ...makeTransaction(),
    deletion: {
      deletedAt: '2024-01-10T12:00:00.000Z',
      purgeAt: '2024-02-09T12:00:00.000Z',
    },
  };

  return {
    ...base,
    ...overrides,
    category: { ...base.category, ...overrides.category },
    paymentMethod: { ...base.paymentMethod, ...overrides.paymentMethod },
    account: { ...base.account, ...overrides.account },
    deletion: { ...base.deletion, ...overrides.deletion },
  };
};
