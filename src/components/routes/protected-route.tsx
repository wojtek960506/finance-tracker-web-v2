import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";


type ProtectedRouteProps = {
  isAuthenticated: boolean,
  children: ReactNode,
}

export const ProtectedRoute = ({
  isAuthenticated,
  children
}: ProtectedRouteProps) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
