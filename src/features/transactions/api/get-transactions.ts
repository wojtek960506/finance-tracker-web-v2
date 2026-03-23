import { BASE_URL } from '@shared/consts';

export type Transaction = {
  date: string;
  description: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  account: string;
  transactionType: string;
  id: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  sourceIndex: string;
  sourceRefIndex?: string;
  refId?: string;
  currencies: string;
  exchangeRate: string;
  category: {
    id: string;
    type: string;
    name: string;
  };
};

export type TransactionsResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: Transaction[];
};

export const getTransactions = async (
  authToken: string | null,
): Promise<TransactionsResponse> => {
  const params = new URLSearchParams({
    page: '1',
    limit: '30',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const res = await fetch(`${BASE_URL}/api/transactions?${params}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!res.ok) throw new Error('error getting transactions');

  return res.json();
};
