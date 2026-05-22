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
          flex flex-col bg-white border-r border-gray-100 shrink-0
          transition-all duration-300
          ${collapsed ? "w-16" : "w-56"}
        `}
      >
        {/* Logo + collapse toggle */}
        <div
          className={`flex items-center h-16 px-4 border-b border-gray-100 ${collapsed ? "justify-center" : "justify-between"}`}
        >
          {!collapsed && (
            <span className="font-bold text-gray-900 text-sm tracking-wide truncate">
              MyApp
            </span>
          )}
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition shrink-0"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }
                ${collapsed ? "justify-center" : ""}`
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}

          {/* Admin shortcut — only visible to staff/admin */}
          {(user?.role === "admin" || user?.role === "staff") && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mt-2
                ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-violet-600 hover:bg-violet-50 hover:text-violet-700"
                }
                ${collapsed ? "justify-center" : ""}`
              }
            >
              <Shield size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">Admin</span>}
            </NavLink>
          )}
        </nav>

        {/* User + logout */}
        <div
          className={`border-t border-gray-100 p-3 ${collapsed ? "flex justify-center" : ""}`}
        >
          {!collapsed && (
            <div className="mb-2 px-2">
              <p className="text-xs font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={() => logout()}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition w-full ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6">
          <p className="text-sm text-gray-400">
            Welcome back,{" "}
            <span className="font-medium text-gray-700">
              {user?.name?.split(" ")[0]}
            </span>
          </p>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
