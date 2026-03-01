import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@components/layout";
import { useAuthToken } from "@/hooks/use-auth-token";
import { getTransactions } from "@/api/get-transactions";
import { useQuery, useQueryClient } from "@tanstack/react-query";


export const Transactions = () => {
  const navigate = useNavigate();
  const { authToken, removeAuthToken } = useAuthToken();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => await getTransactions(authToken)
  });

  if (isLoading) return <MobileLayout><p>Loading</p></MobileLayout>
  if (error) return <MobileLayout><p>{error.message}</p></MobileLayout>

  return (
    <MobileLayout>
      <h1>Transactions will be here</h1>
      <ul>
        {data?.items.map(transaction => (
          <li key={transaction.id}>
            {`${transaction.date} ${transaction.description}`}
          </li>
        ))}
      </ul>

      <button
        className="border border-fg py-2 px-4 rounded-xl mt-1 bg-bg hover:bg-fg/20 cursor-pointer"
        onClick={() => {
          removeAuthToken();
          queryClient.clear();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </MobileLayout>
  );
}
