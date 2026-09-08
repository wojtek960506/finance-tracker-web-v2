import type { Transaction, TrashedTransaction } from '@transactions/api';

export const makeTransaction = (overrides: Partial<Transaction> = {}): Transaction => {
  const defaultCategory: Transaction['category'] = {
    id: 'cat-1',
    type: 'user',
    name: 'Food',
  };
  const category: Transaction['category'] = overrides.category
    ? { ...defaultCategory, ...overrides.category }
    : defaultCategory;

  const derivedKind =
    category.type === 'system' && category.name === 'myAccount'
      ? 'transfer'
      : category.type === 'system' && category.name === 'exchange'
        ? 'exchange'
        : 'standard';

  const base: Transaction = {
    id: 'tx-1',
    ownerId: 'owner-1',
    kind: overrides.kind ?? derivedKind,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-02',
    sourceIndex: 1,
    date: '2024-01-03',
    description: 'Test transaction',
    amount: 10,
    currency: 'USD',
    transactionType: 'expense',
    refId: undefined,
    currencies: undefined,
    exchangeRate: undefined,
    category,
    paymentMethod: { id: 'pm-1', type: 'user', name: 'Card' },
    account: { id: 'acc-1', type: 'user', name: 'Main' },
  };

  return {
    ...base,
    ...overrides,
    category,
    paymentMethod: { ...base.paymentMethod, ...overrides.paymentMethod },
    account: { ...base.account, ...overrides.account },
  };
};

export const makeTrashedTransaction = (
  overrides: Partial<TrashedTransaction> = {},
): TrashedTransaction => {
  const base: TrashedTransaction = {
    ...makeTransaction(overrides),
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
