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

export type TrashedTransactionsResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: TrashedTransaction[];
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
