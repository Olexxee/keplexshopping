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
  Settings,
  ChevronDown,
  Shield,
} from "lucide-react";
import { useLogout } from "../../hooks/useAuth";
import { useMe } from "../../hooks/useAuth";
import { cn } from "../../lib/cn";

const NAV_ITEMS = [
  { to: "/admin", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/items", icon: Package, label: "Items" },
  { to: "/admin/categories", icon: Tag, label: "Categories" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
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
    <div className="flex min-h-screen bg-gradient-to-br from-background via-amber-50/20 to-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col bg-gradient-to-b from-amber-900 via-amber-800 to-amber-950 text-white transition-all duration-300 shrink-0 sticky top-0 h-screen",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo + collapse toggle */}
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b border-amber-700/50",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-amber">
                <span className="text-white font-display font-bold text-sm">A</span>
              </div>
              <span className="font-display font-semibold text-lg tracking-tight text-white">
                Admin
              </span>
            </div>
          )}
          {collapsed && (
            <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-amber">
              <span className="text-white font-display font-bold text-sm">A</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="p-1.5 rounded-lg hover:bg-amber-700/50 transition shrink-0"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-amber-500 text-white shadow-amber shadow-lg"
                    : "text-amber-100 hover:bg-amber-700/50 hover:text-white",
                  collapsed ? "justify-center" : ""
                )
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div
          className={cn(
            "border-t border-amber-700/50 p-3",
            collapsed ? "flex flex-col items-center gap-2" : ""
          )}
        >
          {!collapsed && (
            <div className="mb-2 px-2">
              <p className="text-sm font-medium text-white truncate">
                {user?.fullName || "Admin User"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-amber-200 truncate capitalize">
                  {user?.role || "Administrator"}
                </p>
                <span className="inline-flex items-center gap-1 text-xs bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded-full">
                  <Shield size={10} />
                  Admin
                </span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <span className="text-white font-display font-semibold text-sm">
                {user?.fullName?.charAt(0) || "A"}
              </span>
            </div>
          )}
          <button
            onClick={() => logout()}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-amber-100 hover:bg-amber-700/50 hover:text-white transition-all duration-200 w-full",
              collapsed ? "justify-center" : ""
            )}
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-10 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Logged in as{" "}
              <span className="font-medium text-foreground">{user?.fullName || "Admin"}</span>
              <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber/10 text-amber rounded-full text-xs font-medium border border-amber/20">
                <Shield size={10} />
                {user?.role || "Admin"}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-amber/10 flex items-center justify-center">
                <span className="text-amber font-display font-semibold text-sm">
                  {user?.fullName?.charAt(0) || "A"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};