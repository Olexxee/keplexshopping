import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "../../hooks/useAuth";

export const ProtectedRoute = () => {
  const { data: user, isLoading } = useMe();

  if (isLoading) return null;

  if (!user || user === null) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};