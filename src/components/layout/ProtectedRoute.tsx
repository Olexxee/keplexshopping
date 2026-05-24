import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "../../hooks/useAuth";

export const ProtectedRoute = () => {
  const { data: user, isLoading } = useMe();

  if (isLoading) return null; // or a spinner

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};