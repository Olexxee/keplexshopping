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
  Menu,
  X,
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
  {
    to: "/admin/training-registrations",
    icon: ClipboardList,
    label: "Training Registrations",
  },
];

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: user } = useMe();
  const { mutate: logout } = useLogout();

  // Shared inner navigation panel so we don't repeat the link listings
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-700 via-indigo-700 to-indigo-900 text-white">
      {/* Logo Area */}
      <div
        className={`flex items-center h-16 px-4 border-b border-purple-600 ${
          collapsed && !isMobile ? "justify-center" : "justify-between"
        }`}
      >
        {(!collapsed || isMobile) && (
          <span className="font-bold text-sm tracking-wide truncate bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Admin Panel
          </span>
        )}

        {/* Toggle desktop sidebar / close mobile drawer */}
        {isMobile ? (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-purple-600 transition text-white"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="p-1.5 rounded-lg hover:bg-purple-600 transition shrink-0"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-gradient-to-r from-cyan-400 to-blue-400 text-purple-900 shadow-md"
                  : "text-purple-100 hover:bg-purple-600 hover:text-white"
              }
              ${collapsed && !isMobile ? "justify-center" : ""}`
            }
          >
            <Icon size={18} className="shrink-0" />
            {(!collapsed || isMobile) && (
              <span className="truncate">{label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info / logout footer */}
      <div
        className={`border-t border-purple-600 p-3 ${collapsed && !isMobile ? "flex justify-center" : ""}`}
      >
        {(!collapsed || isMobile) && (
          <div className="mb-2 px-2">
            <p className="text-xs font-medium text-white truncate">
              {user?.fullName}
            </p>
            <p className="text-xs text-purple-200 truncate">{user?.role}</p>
          </div>
        )}
        <button
          onClick={() => logout()}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-purple-100 hover:bg-purple-600 hover:text-white transition w-full ${
            collapsed && !isMobile ? "justify-center" : ""
          }`}
        >
          <LogOut size={16} className="shrink-0" />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* 1. MOBILE DRAWER OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 transition-transform duration-300 transform lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent isMobile={true} />
      </aside>

      {/* 2. DESKTOP PERMANENT SIDEBAR */}
      <aside
        className={`
          hidden lg:flex flex-col transition-all duration-300 shrink-0 h-screen sticky top-0
          ${collapsed ? "w-16" : "w-56"}
        `}
      >
        <SidebarContent isMobile={false} />
      </aside>

      {/* 3. MAIN WRAPPER CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Dynamic Top Header Navigation */}
        <header className="h-16 bg-gradient-to-r from-white to-purple-50 border-b border-purple-200 flex items-center justify-between lg:justify-end px-4 sm:px-6">
          {/* Menu button visible strictly on mobile screens */}
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-xl text-purple-700 hover:bg-purple-50 lg:hidden transition"
          >
            <Menu size={22} />
          </button>

          <p className="text-xs sm:text-sm text-purple-600 truncate max-w-[220px] sm:max-w-none">
            Logged in as{" "}
            <span className="font-medium text-purple-700">
              {user?.fullName}
            </span>
            <span className="ml-2 inline-block px-2 py-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-[10px] sm:text-xs rounded-full capitalize font-medium">
              {user?.role}
            </span>
          </p>
        </header>

        {/* Core content wrapper viewport */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
