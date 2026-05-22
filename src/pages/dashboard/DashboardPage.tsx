import { useMe } from "../../hooks/useAuth";
import { useMyOrders } from "../../hooks/useOrders";
import { useCart } from "../../hooks/useCart";
import { useAddresses } from "../../hooks/useAddresses";
import { StatCard } from "../../components/ui/StatCard";

export const DashboardPage = () => {
  const { data: user } = useMe();
  const { data: orders } = useMyOrders();
  const { data: cart } = useCart();
  const { data: addresses } = useAddresses();

    // Guard against untyped/empty cart objects coming from hooks
    const cartItemCount = (cart as any)?.totalItems ?? 0;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm uppercase tracking-wide text-gray-400">
          Overview
        </p>
        <h1 className="text-3xl font-bold mt-2">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-gray-500 mt-3">
          Manage your orders, profile, and addresses from your dashboard.
        </p>
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
        <StatCard label="Saved Addresses" value={Array.isArray(addresses) ? addresses.length : 0} />
      </div>
    </div>
  );
};
