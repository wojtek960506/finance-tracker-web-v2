import { Navigate, Outlet } from "react-router-dom";


type PublicOnlyLayoutProps = { isAuthenticated: boolean }

export const PublicLayout = ({ isAuthenticated }: PublicOnlyLayoutProps) => {
  if (isAuthenticated) return <Navigate to="/transactions" replace />;

  return <Outlet />;
}
