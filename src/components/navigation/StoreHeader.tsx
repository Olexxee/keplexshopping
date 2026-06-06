import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useMe } from "../../hooks/useAuth";

export const StoreHeader = () => {
  const { data: user } = useMe();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <Link to="/shop" className="text-xl font-bold text-gray-900">
          Keplex
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          <NavLink to="/orders">Orders</NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart">
            <ShoppingCart size={20} />
          </Link>

          <Link
            to="/profile"
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            {user?.fullName ? (
              user.fullName.charAt(0).toUpperCase()
            ) : (
              <User size={18} />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
