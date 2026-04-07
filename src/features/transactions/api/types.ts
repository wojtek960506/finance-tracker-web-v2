export type NamedResource = {
  id: string;
  type: string;
  name: string;
};

export type TransactionType = 'expense' | 'income';

export type TransactionStandardCreateDTO = {
  date: string;
  description: string;
  amount: number;
  currency: string;
  categoryId: string;
  paymentMethodId: string;
  accountId: string;
  transactionType: TransactionType;
};

export type Transaction = {
  date: string;
  description: string;
  amount: number;
  currency: string;
  transactionType: string;
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

export type TransactionsResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: Transaction[];
};
