import type {
  Transaction,
  TransactionDetails,
  TrashedTransaction,
  TrashedTransactionDetails,
} from '@transactions/api';

export const makeTransaction = (overrides: Partial<Transaction> = {}): Transaction => {
  const kind = overrides.kind ?? 'standard';

  const baseCommon = {
    id: 'tx-1',
    ownerId: 'owner-1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-02',
    sourceIndex: 1,
    date: '2024-01-03',
    description: 'Test transaction',
    amount: 10,
    currency: 'USD' as const,
    transactionType: 'expense' as const,
    category: { id: 'cat-1', type: 'user' as const, name: 'Food' },
    paymentMethod: { id: 'pm-1', type: 'user' as const, name: 'Card' },
    account: { id: 'acc-1', type: 'user' as const, name: 'Main' },
  };

  if (kind === 'exchange') {
    return {
      ...baseCommon,
      kind: 'exchange',
      currencies: 'USD/EUR',
      exchangeRate: 1.05,
      ...overrides,
      category: { ...baseCommon.category, ...overrides.category },
      paymentMethod: { ...baseCommon.paymentMethod, ...overrides.paymentMethod },
      account: { ...baseCommon.account, ...overrides.account },
    } as Transaction;
  }

  if (kind === 'investment') {
    return {
      ...baseCommon,
      kind: 'investment',
      ...overrides,
      category: { ...baseCommon.category, ...overrides.category },
      paymentMethod: { ...baseCommon.paymentMethod, ...overrides.paymentMethod },
      account: { ...baseCommon.account, ...overrides.account },
    } as Transaction;
  }

  if (kind === 'transfer') {
    return {
      ...baseCommon,
      kind: 'transfer',
      ...overrides,
      category: { ...baseCommon.category, ...overrides.category },
      paymentMethod: { ...baseCommon.paymentMethod, ...overrides.paymentMethod },
      account: { ...baseCommon.account, ...overrides.account },
    } as Transaction;
  }

  return {
    ...baseCommon,
    kind: 'standard',
    ...overrides,
    category: { ...baseCommon.category, ...overrides.category },
    paymentMethod: { ...baseCommon.paymentMethod, ...overrides.paymentMethod },
    account: { ...baseCommon.account, ...overrides.account },
  } as Transaction;
};

export const makeTransactionDetails = (
  overrides: Record<string, unknown> = {},
): TransactionDetails => {
  return makeTransaction(
    overrides as Partial<Transaction>,
  ) as unknown as TransactionDetails;
};

export const makeTrashedTransaction = (
  overrides: Partial<TrashedTransaction> = {},
): TrashedTransaction => {
  const base = makeTransaction(overrides as Partial<Transaction>);
  const deletion = {
    deletedAt: '2024-01-10T12:00:00.000Z',
    purgeAt: '2024-02-09T12:00:00.000Z',
    ...overrides.deletion,
  };

  return {
    ...base,
    ...overrides,
    category: { ...base.category, ...overrides.category },
    paymentMethod: { ...base.paymentMethod, ...overrides.paymentMethod },
    account: { ...base.account, ...overrides.account },
    deletion,
  } as TrashedTransaction;
};

export const makeTrashedTransactionDetails = (
  overrides: Record<string, unknown> = {},
): TrashedTransactionDetails => {
  return makeTrashedTransaction(
    overrides as Partial<TrashedTransaction>,
  ) as unknown as TrashedTransactionDetails;
};
