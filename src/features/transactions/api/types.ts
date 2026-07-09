export type NamedResource = {
  id: string;
  type: string;
  name: string;
};

export type TransactionType = 'expense' | 'income';

export type TransactionStandardDTO = {
  date: string;
  description: string;
  amount: number;
  currency: string;
  categoryId?: string | null;
  paymentMethodId?: string | null;
  accountId?: string | null;
  transactionType: TransactionType;
};

export type TransactionTransferDTO = {
  date: string;
  description: string;
  amount: number;
  currency: string;
  accountExpenseId?: string | null;
  accountIncomeId?: string | null;
  paymentMethodId?: string | null;
};

export type TransactionExchangeDTO = {
  date: string;
  description: string;
  amountExpense: number;
  amountIncome: number;
  currencyExpense: string;
  currencyIncome: string;
  accountExpenseId?: string | null;
  accountIncomeId?: string | null;
  paymentMethodId?: string | null;
};

export type BulkTransactionDTO =
  | ({ kind: 'standard' } & TransactionStandardDTO)
  | ({ kind: 'transfer' } & TransactionTransferDTO)
  | ({ kind: 'exchange' } & TransactionExchangeDTO);

export type CreateBulkTransactionsDTO = {
  transactions: BulkTransactionDTO[];
};

export type Transaction = {
  date: string;
  description: string;
  amount: number;
  currency: string;
  transactionType: TransactionType;
  id: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  sourceIndex: string;
  sourceRefIndex?: string;
  refId?: string;
  currencies?: string;
  exchangeRate?: number;
  category: NamedResource;
  paymentMethod: NamedResource;
  account: NamedResource;
};

export type TransactionDeletion = {
  deletedAt: string;
  purgeAt: string;
};

export type TransactionDetails = Transaction & {
  reference?: Transaction;
};

export type TrashedTransaction = Transaction & {
  deletion: TransactionDeletion;
};

export type TrashedTransactionDetails = TrashedTransaction & {
  reference?: TrashedTransaction;
};

export type TransactionsResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: Transaction[];
};

export type TransactionFilters = {
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  transactionType?: TransactionType;
  currency?: string;
  categoryIds?: string[];
  excludeCategoryIds?: string[];
  paymentMethodIds?: string[];
  excludePaymentMethodIds?: string[];
  accountIds?: string[];
  excludeAccountIds?: string[];
};

export type GetTransactionsQuery = {
  page?: number;
  filters?: TransactionFilters;
};

export type TrashedTransactionsResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: TrashedTransaction[];
};

export type TransactionTotalsDetails = {
  totalAmount: number;
  totalItems: number;
  averageAmount: number;
  maxAmount: number;
  minAmount: number;
};

export type TransactionTotalsByCurrency = {
  totalItems: number;
  expense: TransactionTotalsDetails;
  income: TransactionTotalsDetails;
};

export type TransactionTotalsOverall = {
  totalItems: number;
  expense: { totalItems: number };
  income: { totalItems: number };
};

export type TransactionTotalsResponse = {
  byCurrency: Record<string, TransactionTotalsByCurrency>;
  overall: TransactionTotalsOverall;
};

export type TransactionAccountStatisticsAccount = {
  accountId: string;
  accountName: string;
  accountType: 'user' | 'system';
  totalAmount: number;
  totalItems: number;
  normalizedTotalAmount?: number;
};

export type TransactionAccountStatisticsCurrency = {
  currency: string;
  totalAmount: number;
  totalItems: number;
  normalizedTotalAmount?: number;
  accounts: TransactionAccountStatisticsAccount[];
};

export type TransactionAccountStatisticsResponse = {
  currencies: TransactionAccountStatisticsCurrency[];
  normalizedBaseCurrency?: string;
  normalizedTotalAmount?: number;
};

export type TransactionAccountStatisticsQuery = Pick<
  TransactionFilters,
  'startDate' | 'endDate' | 'transactionType' | 'currency'
> & {
  baseCurrency?: string;
};

export type UpdateManyReply = {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
};

export type DeleteManyReply = {
  acknowledged: boolean;
  deletedCount: number;
};
