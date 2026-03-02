import { Navigate } from "react-router-dom";
import { useAuth } from "../context/contextAuth";
import type { ReactNode } from "react";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
