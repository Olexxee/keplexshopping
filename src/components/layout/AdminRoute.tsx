import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "../../hooks/useAuth";

export const AdminRoute = () => {
  const { data: user, isLoading } = useMe();

  if (isLoading) return null; // ProtectedRoute above already shows the loader

  if (!user || (user.role !== "admin" && user.role !== "staff")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
