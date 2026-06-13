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
    <div className="space-y-8 py-8">
      {/* Welcome Section */}
      <div className="bg-card rounded-xl border border-border shadow-md p-6 md:p-8 relative overflow-hidden">
        {/* Decorative gradient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-amber/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10">
          <p className="text-sm font-medium text-amber uppercase tracking-wider">
            Overview
          </p>
          <h1 className="font-display text-display-md text-foreground mt-2">
            Welcome back, <span className="bg-gradient-amber bg-clip-text text-transparent">
              {user?.fullName?.split(" ")[0]}
            </span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your account.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <DashboardStats orders={orders} addresses={addresses} />

      {/* Cards Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecentOrdersCard orders={orders} />
        <DefaultAddressCard addresses={addresses} />
      </div>
    </div>
  );
};