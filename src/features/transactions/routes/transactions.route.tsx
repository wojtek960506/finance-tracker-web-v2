import { useQuery } from '@tanstack/react-query';

import { useAuthToken } from '@shared/hooks';
import { getTransactions } from '@transactions/api';
import { TransactionsList } from '@transactions/components/transactions-list';

export const TransactionsRoute = () => {
  const { authToken } = useAuthToken();
  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => await getTransactions(authToken),
  });

  if (isLoading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <TransactionsList transactions={data?.items} />
    </>
  );
};
