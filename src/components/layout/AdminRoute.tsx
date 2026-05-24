import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "../../hooks/useAuth";


export const AdminRoute = () => {
  const { data: user, isLoading } = useMe();

  console.log("user role:", user?.role);

  if (isLoading) return null;

  if (!user || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
