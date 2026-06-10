import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, User, LogOut, UserCircle } from "lucide-react";
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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-white via-purple-50 to-pink-50 backdrop-blur-xl border-b-2 border-gradient-to-r from-purple-200 to-pink-200 shadow-lg">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <Link
  to="/shop"
  className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
>
          Keplex
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/shop" className="font-medium text-gray-700 hover:text-purple-600 transition">{({isActive}) => isActive ? <span className="text-purple-600 border-b-2 border-purple-600 pb-1">Shop</span> : <span>Shop</span>}</NavLink>
          <NavLink to="/cart" className="font-medium text-gray-700 hover:text-purple-600 transition">{({isActive}) => isActive ? <span className="text-purple-600 border-b-2 border-purple-600 pb-1">Cart</span> : <span>Cart</span>}</NavLink>
          <NavLink to="/orders" className="font-medium text-gray-700 hover:text-purple-600 transition">{({isActive}) => isActive ? <span className="text-purple-600 border-b-2 border-purple-600 pb-1">Orders</span> : <span>Orders</span>}</NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="text-purple-600 hover:text-pink-600 transition-colors">
            <ShoppingCart size={20} />
          </Link>

          {/* Avatar + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-sm font-semibold text-white hover:shadow-lg hover:scale-110 transition-all"
            >
              {user?.fullName ? (
                user.fullName.charAt(0).toUpperCase()
              ) : (
                <User size={18} />
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-200 shadow-xl py-1.5 z-50">
                {/* User info */}
                <div className="px-4 py-2 border-b-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <p className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-purple-600 truncate">
                    {user?.email}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-purple-600 hover:bg-purple-100 hover:text-purple-800 transition font-medium"
                >
                  <UserCircle size={15} />
                  Profile
                </Link>

                <button
                  onClick={() => logout()}
                  disabled={loggingOut}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-md disabled:opacity-50 transition font-medium"
                >
                  <LogOut size={15} />
                  {loggingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
