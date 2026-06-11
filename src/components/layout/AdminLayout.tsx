import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
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
  MessageSquare,
  Book,
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
  { to: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { to: "/admin/business-config", icon: Building2, label: "Business Config" },
  { to: "/admin/training-programs", icon: Book, label: "Training Programs" },
  { to: "/admin/training-registrations", icon: ClipboardList, label: "Training Registrations" },
];

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { data: user } = useMe();
  const { mutate: logout } = useLogout();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Sidebar */}
      <aside
        className={`
          flex flex-col bg-gradient-to-b from-purple-700 via-indigo-700 to-indigo-900 text-white transition-all duration-300 shrink-0
          ${collapsed ? "w-16" : "w-56"}
        `}
      >
        {/* Logo + collapse toggle */}
        <div
          className={`flex items-center h-16 px-4 border-b border-purple-600 ${collapsed ? "justify-center" : "justify-between"}`}
        >
          {!collapsed && (
            <span className="font-bold text-sm tracking-wide truncate bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Admin Panel
            </span>
          )}
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="p-1.5 rounded-lg hover:bg-purple-600 transition shrink-0"
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
                    ? "bg-gradient-to-r from-cyan-400 to-blue-400 text-purple-900 shadow-md"
                    : "text-purple-100 hover:bg-purple-600 hover:text-white"
                }
                ${collapsed ? "justify-center" : ""}`
              }
            >
              {({ }) => (
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
          className={`border-t border-purple-600 p-3 ${collapsed ? "flex justify-center" : ""}`}
        >
          {!collapsed && (
            <div className="mb-2 px-2">
              <p className="text-xs font-medium text-white truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-purple-200 truncate">{user?.role}</p>
            </div>
          )}
          <button
            onClick={() => logout()}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-purple-100 hover:bg-purple-600 hover:text-white transition w-full ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-gradient-to-r from-white to-purple-50 border-b border-purple-200 flex items-center px-6">
          <p className="text-sm text-purple-600">
            Logged in as{" "}
            <span className="font-medium text-purple-700">{user?.fullName}</span>
            <span className="ml-2 inline-block px-2 py-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full capitalize font-medium">
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
