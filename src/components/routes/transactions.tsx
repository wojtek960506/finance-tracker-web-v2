import { useLocalStorage } from "@/hooks";
import { MobileLayout } from "@components/layout";
import { useNavigate } from "react-router-dom";


export const Transactions = () => {
  const navigate = useNavigate();
  const { removeItem } = useLocalStorage("token");

  return (
    <MobileLayout>
      <h1>Transactions will be here</h1>
      <button
        className="border border-fg py-2 px-4 rounded-xl mt-1 bg-bg hover:bg-fg/20 cursor-pointer"
        onClick={() => {
          removeItem();
          navigate("/login");
        }}
      >
        Navigate to login
      </button>
    </MobileLayout>
  )
}
