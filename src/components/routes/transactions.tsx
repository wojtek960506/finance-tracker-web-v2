import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@components/layout";
import { useAuthToken } from "@/hooks/use-auth-token";


export const Transactions = () => {
  const navigate = useNavigate();
  const { removeAuthToken } = useAuthToken();

  return (
    <MobileLayout>
      <h1>Transactions will be here</h1>
      <button
        className="border border-fg py-2 px-4 rounded-xl mt-1 bg-bg hover:bg-fg/20 cursor-pointer"
        onClick={() => {
          removeAuthToken();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </MobileLayout>
  );
}
