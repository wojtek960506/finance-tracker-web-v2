import { Navigate, Outlet } from 'react-router-dom';

type ProtectedLayoutProps = { isAuthenticated: boolean };

export const ProtectedLayout = ({ isAuthenticated }: ProtectedLayoutProps) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col p-3 sm:p-4">
      <Outlet />
    </div>
  );
};
