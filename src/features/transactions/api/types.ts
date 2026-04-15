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
  categoryId: string;
  paymentMethodId: string;
  accountId: string;
  transactionType: TransactionType;
};

export type TransactionTransferDTO = {
  date: string;
  additionalDescription?: string;
  amount: number;
  currency: string;
  accountExpenseId: string;
  accountIncomeId: string;
  paymentMethodId: string;
};

export type TransactionExchangeDTO = {
  date: string;
  additionalDescription?: string;
  amountExpense: number;
  amountIncome: number;
  currencyExpense: string;
  currencyIncome: string;
  accountId: string;
  paymentMethodId: string;
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
  categoryId?: string;
  excludeCategoryIds?: string[];
  paymentMethodId?: string;
  accountId?: string;
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
}

export type TransactionTotalsResponse = {
  byCurrency: Record<string, TransactionTotalsByCurrency>;
  overall: TransactionTotalsOverall;
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
