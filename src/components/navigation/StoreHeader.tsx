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
<header
  className="
  sticky top-0 z-50
  bg-white/80
  backdrop-blur-xl
  border-b
  border-border/50
  shadow-sm
"
>
  <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <Link
  to="/shop"
  className="flex items-center gap-3"
>
  <div
    className="
    h-10 w-10
    rounded-xl
    bg-primary
    text-primary-foreground
    flex items-center justify-center
    font-semibold
    shadow-amber
    "
  >
    K
  </div>

  <div>
    <p className="font-semibold text-lg tracking-tight">
      Keplex
    </p>

    <p className="text-xs text-muted-foreground">
      Modern Marketplace
    </p>
  </div>
</Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/shop" className="font-medium text-gray-700 hover:text-purple-600 transition">{({isActive}) => isActive ? <span className="text-purple-600 border-b-2 border-purple-600 pb-1">Shop</span> : <span>Shop</span>}</NavLink>
          <NavLink to="/cart" className="font-medium text-gray-700 hover:text-purple-600 transition">{({isActive}) => isActive ? <span className="text-purple-600 border-b-2 border-purple-600 pb-1">Cart</span> : <span>Cart</span>}</NavLink>
          <NavLink to="/orders" className="font-medium text-gray-700 hover:text-purple-600 transition">{({isActive}) => isActive ? <span className="text-purple-600 border-b-2 border-purple-600 pb-1">Orders</span> : <span>Orders</span>}</NavLink>
        </nav>

        <div className="relative">
  <ShoppingCart size={22} />

  <span
    className="
    absolute
    -top-2
    -right-2
    h-5
    w-5
    rounded-full
    bg-pink-500
    text-white
    text-[10px]
    flex
    items-center
    justify-center
    "
  >
    3
  </span>
</div>

          {/* Avatar + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="
                  h-11
                  w-11
                  rounded-2xl
                  bg-gradient-primary
                  text-white
                  font-semibold
                  shadow-lg
                  hover:scale-105
                  transition-all
                  "
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
                <div
                    className="
                    p-4
                    bg-gradient-to-r
                    from-pink-50
                    to-cyan-50
                    border-b
                    "
                  >
                    <h3 className="font-semibold text-slate-900">
                      {user?.fullName}
                    </h3>

                    <p className="text-sm text-slate-500">
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
