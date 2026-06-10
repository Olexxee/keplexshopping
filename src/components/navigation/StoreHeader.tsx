import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, User, LogOut, UserCircle, Search } from "lucide-react";
import { useMe } from "../../hooks/useAuth";
import { useLogout } from "../../hooks/useAuth";

export const StoreHeader = () => {
  const { data: user } = useMe();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main header bar */}
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/shop" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl font-black text-brand-600">
              KEPLEX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `font-semibold transition-colors text-sm ${
                  isActive ? "text-brand-600" : "text-muted hover:text-primary"
                }`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `font-semibold transition-colors text-sm ${
                  isActive ? "text-brand-600" : "text-muted hover:text-primary"
                }`
              }
            >
              Orders
            </NavLink>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-6">
            {/* Search icon */}
            <button className="p-2 text-muted hover:text-primary transition rounded-lg">
              <Search size={20} />
            </button>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-muted hover:text-primary transition rounded-lg"
            >
              <ShoppingCart size={20} />
              <span className="absolute top-1 right-1 w-5 h-5 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User Avatar + Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700 hover:bg-brand-200 transition duration-200"
              >
                {user?.fullName ? (
                  user.fullName.charAt(0).toUpperCase()
                ) : (
                  <User size={18} />
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface rounded-lg border border-border shadow-lg py-1 z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-bold text-primary truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:bg-background hover:text-primary transition"
                  >
                    <UserCircle size={16} />
                    Profile
                  </Link>

                  <button
                    onClick={() => logout()}
                    disabled={loggingOut}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-danger hover:bg-red-50 disabled:opacity-50 transition"
                  >
                    <LogOut size={16} />
                    {loggingOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
