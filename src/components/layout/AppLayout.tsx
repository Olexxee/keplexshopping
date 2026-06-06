import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
} from "lucide-react";
import { useMe, useLogout } from "../../hooks/useAuth";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/shop", icon: ShoppingBag, label: "Shop" },
  { to: "/cart", icon: ShoppingCart, label: "Cart" },
  { to: "/orders", icon: ClipboardList, label: "Orders" },
  { to: "/addresses", icon: MapPin, label: "Addresses" },
  { to: "/profile", icon: User, label: "Profile" },
];

export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { data: user } = useMe();
  const { mutate: logout } = useLogout();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          flex flex-col bg-white border-r border-gray-200 shrink-0
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Logo + collapse toggle */}
        <div
          className={`
            flex items-center h-16 px-4 border-b border-gray-200
            ${collapsed ? "justify-center" : "justify-between"}
          `}
        >
          {!collapsed && (
            <span className="font-bold text-gray-900 text-lg tracking-tight">
              StoreHub
            </span>
          )}
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 shrink-0 text-gray-500 hover:text-gray-900"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-6 space-y-1 px-3">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-gray-900 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
                ${collapsed ? "justify-center" : ""}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}

          {/* Admin shortcut — only visible to staff/admin */}
          {user?.role &&
            ["SUPER_ADMIN", "ADMIN", "STAFF"].includes(user.role) && (
              <>
                <div
                  className={`border-t border-gray-200 my-4 ${collapsed ? "mx-2" : ""}`}
                />
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md"
                      : "text-violet-600 hover:bg-violet-50 hover:text-violet-700"
                  }
                  ${collapsed ? "justify-center" : ""}`
                  }
                  title={collapsed ? "Admin" : undefined}
                >
                  <Shield size={20} className="shrink-0" />
                  {!collapsed && <span className="truncate">Admin Panel</span>}
                </NavLink>
              </>
            )}
        </nav>

        {/* User + logout */}
        <div
          className={`border-t border-gray-200 p-4 ${collapsed ? "flex justify-center" : ""}`}
        >
          {!collapsed && user && (
            <div className="mb-3 px-2 pb-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {user.email}
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                {user.role?.toLowerCase()}
              </span>
            </div>
          )}
          <button
            onClick={() => logout()}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
              text-gray-600 hover:text-red-600 hover:bg-red-50
              transition-all duration-200 w-full
              ${collapsed ? "justify-center" : ""}
            `}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <p className="text-sm text-gray-500">
            Welcome back,{" "}
            <span className="font-semibold text-gray-900">
              {user?.fullName?.split(" ")[0] || "User"}
            </span>
          </p>
          {/* Optional: Add notification bell or quick actions here */}
        </header>
        <main className="flex-1 p-8 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
