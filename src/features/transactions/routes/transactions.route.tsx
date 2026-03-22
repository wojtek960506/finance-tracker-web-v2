import { useQuery } from "@tanstack/react-query";

import { useAuthToken } from "@shared/hooks";
import { getTransactions } from "@transactions/api";


export const TransactionsRoute = () => {
  
  const { authToken } = useAuthToken();
  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => await getTransactions(authToken)
  });

  if (isLoading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <h1>Transactions will be here</h1>
      <ul>
        {data?.items.map(transaction => (
          <li key={transaction.id}>
            {`${transaction.date} ${transaction.description}`}
          </li>
        ))}
      </ul>
    </>
  );
}
