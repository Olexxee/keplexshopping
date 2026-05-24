import { useMe } from "../../hooks/useAuth";
import { useMyOrders } from "../../hooks/useOrders";
import { useCart } from "../../hooks/useCart";
import { useAddresses } from "../../hooks/useAddresses";
import { useLogout } from "../../hooks/useAuth";
import { StatCard } from "../../components/ui/StatCard";
import { LogOut } from "lucide-react";

export const DashboardPage = () => {
  const { data: user } = useMe();
  const { data: orders } = useMyOrders();
  const { data: cart } = useCart();
  const { data: addresses } = useAddresses();
  const { mutate: logout } = useLogout();

  const cartItemCount = (cart as any)?.totalItems ?? 0;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-400">
              Overview
            </p>
            <h1 className="text-3xl font-bold mt-2">
              Welcome back{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}
            </h1>
            <p className="text-gray-500 mt-3">
              Manage your orders, profile, and addresses from your dashboard.
            </p>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          label="Orders"
          value={Array.isArray(orders) ? orders.length : 0}
          sub={
            Array.isArray(orders) && orders.length === 1
              ? "1 order placed"
              : `${Array.isArray(orders) ? orders.length : 0} orders placed`
          }
        />
        <StatCard
          label="Active Cart"
          value={cartItemCount}
          sub={cartItemCount === 1 ? "1 item" : `${cartItemCount} items`}
        />
        <StatCard
          label="Saved Addresses"
          value={Array.isArray(addresses) ? addresses.length : 0}
        />
      </div>
    </div>
  );
};
