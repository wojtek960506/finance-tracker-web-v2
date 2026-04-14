import { Navigate, Outlet } from 'react-router-dom';

type ProtectedLayoutProps = { isAuthenticated: boolean };

export const ProtectedLayout = ({ isAuthenticated }: ProtectedLayoutProps) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};
