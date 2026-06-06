import { useMe } from "../../hooks/useAuth";
import { useOrders } from "../../hooks/useOrders";
import { useAddresses } from "../../hooks/useAddresses";

import { DashboardStats } from "../../components/dashboard/DashboardStats";
import { RecentOrdersCard } from "../../components/dashboard/RecentOrdersCard";
import { DefaultAddressCard } from "../../components/dashboard/DefaultAddressCard";

export const DashboardPage = () => {
  const { data: user } = useMe();

  const { data: ordersData } = useOrders();
  const orders = Array.isArray(ordersData) ? ordersData : ordersData?.data ?? [];

  const { data: addresses = [] } = useAddresses();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6">
        <p className="text-sm text-slate-400">Overview</p>

        <h1 className="text-3xl font-bold mt-2">
          Welcome back, {user?.fullName?.split(" ")[0]}
        </h1>

        <p className="text-slate-500 mt-2">
          Here's what's happening with your account.
        </p>
      </div>

      <DashboardStats orders={orders} addresses={addresses} />

      <div className="grid lg:grid-cols-2 gap-6">
        <RecentOrdersCard orders={orders} />

        <DefaultAddressCard addresses={addresses} />
      </div>
    </div>
  );
};
