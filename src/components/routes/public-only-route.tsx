import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";


type PublicOnlyRouteProps = {
  isAuthenticated: boolean,
  children: ReactNode,
}

export const PublicOnlyRoute = ({
  isAuthenticated,
  children
}: PublicOnlyRouteProps) => {
  if (isAuthenticated) return <Navigate to="/transactions" replace />;

  return <>{children}</>;
}
