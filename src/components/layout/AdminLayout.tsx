import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Tag,
  ShoppingBag,
  Building2,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useLogout } from "../../hooks/useAuth";
import { useMe } from "../../hooks/useAuth";

const NAV_ITEMS = [
  { to: "/admin", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/items", icon: Package, label: "Items" },
  { to: "/admin/categories", icon: Tag, label: "Categories" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/settings", icon: Building2, label: "Settings" },
  { to: "/admin/audit", icon: ClipboardList, label: "Audit Logs" },
];

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { data: user } = useMe();
  const { mutate: logout } = useLogout();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          flex flex-col bg-gray-900 text-white transition-all duration-300 shrink-0
          ${collapsed ? "w-16" : "w-56"}
        `}
      >
        {/* Logo + collapse toggle */}
        <div
          className={`flex items-center h-16 px-4 border-b border-gray-800 ${collapsed ? "justify-center" : "justify-between"}`}
        >
          {!collapsed && (
            <span className="font-bold text-sm tracking-wide truncate">
              Admin Panel
            </span>
          )}
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="p-1.5 rounded-lg hover:bg-gray-800 transition shrink-0"
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
                    ? "bg-white text-gray-900"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }
                ${collapsed ? "justify-center" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div
          className={`border-t border-gray-800 p-3 ${collapsed ? "flex justify-center" : ""}`}
        >
          {!collapsed && (
            <div className="mb-2 px-2">
              <p className="text-xs font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
          )}
          <button
            onClick={() => logout()}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition w-full ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6">
          <p className="text-sm text-gray-400">
            Logged in as{" "}
            <span className="font-medium text-gray-700">{user?.name}</span>
            <span className="ml-2 inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
              {user?.role}
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
