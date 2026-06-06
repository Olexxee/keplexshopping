import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AdminRoute } from "./components/layout/AdminRoute";
import { AuthContainer } from "./components/auth/AuthContainer";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { CatalogPage } from "./pages/shop/CategoriesPage";
import { ItemDetailPage } from "./pages/shop/ItemDetailPage";
import { CartPage } from "./pages/shop/CartPage";
import { BusinessConfigPage } from "./pages/admin/BusinessConfigPage";
import { CheckoutPage } from "./pages/shop/CheckoutPage";
import { MyOrdersPage } from "./pages/shop/MyOrdersPage";
import { OrderDetailPage } from "./pages/shop/OrderDetailPage";
import { PaymentCallbackPage } from "./pages/payment/PaymentCallbackPage";
import { AdminOverviewPage } from "./pages/admin/AdminOverviewPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { AddressesPage } from "./pages/dashboard/AddressesPage";
import { ProfilePage } from "./pages/dashboard/ProfilePage";
import { ItemsAdminPage } from "./pages/admin/ItemsAdminPage";
import { CategoriesPage } from "./pages/admin/CatalogPage";
import { AdminOrderDetailPage } from "./pages/admin/OrdersAdminPage";
import { SettingsPage } from "./pages/admin/SettingsPage";
import { AuditPage } from "./pages/admin/AuditPage";    

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/auth", element: <AuthContainer /> },

  {
    element: <ProtectedRoute />,
    children: [
      { path: "/payment/callback", element: <PaymentCallbackPage /> },

      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/shop", element: <CatalogPage /> },
          { path: "/shop/:itemId", element: <ItemDetailPage /> },
          { path: "/cart", element: <CartPage /> },
          { path: "/checkout", element: <CheckoutPage /> },
          { path: "/orders", element: <MyOrdersPage /> },
          { path: "/orders/:id", element: <OrderDetailPage /> },
          { path: "/addresses", element: <AddressesPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },

      {
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "/admin", element: <AdminOverviewPage /> },
              { path: "/admin/users", element: <UsersPage /> },
              { path: "/admin/items", element: <ItemsAdminPage /> },
              {
                path: "/admin/business-config",
                element: <BusinessConfigPage />,
              },
              { path: "/admin/categories", element: <CategoriesPage /> },
              { path: "/admin/orders", element: <AdminOrderDetailPage /> },
              { path: "/admin/settings", element: <SettingsPage /> },
              { path: "/admin/audit", element: <AuditPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
