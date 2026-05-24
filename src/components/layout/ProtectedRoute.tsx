import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "../../hooks/useAuth";

export const ProtectedRoute = () => {
  const { data: user, isLoading, isError } = useMe();

  if (isLoading) return null;

  if (isError || !user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};