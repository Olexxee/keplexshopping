import { StatCard } from "../ui/StatCard";
import type { Order } from "../../types/order.types";
import type { Address } from "../../types/address.types";

interface Props {
  orders: Order[];
  addresses: Address[];
}

export const DashboardStats = ({
  orders,
  addresses,
}: Props) => {
  const pendingOrders = orders.filter(
    (o) =>
      o.status === "PENDING" ||
      o.status === "PROCESSING"
  ).length;

  const completedOrders = orders.filter(
    (o) => o.status === "COMPLETED"
  ).length;

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
      <StatCard
        label="Total Orders"
        value={orders.length}
      />

      <StatCard
        label="Pending Orders"
        value={pendingOrders}
      />

      <StatCard
        label="Completed Orders"
        value={completedOrders}
      />

      <StatCard
        label="Saved Addresses"
        value={addresses.length}
      />
    </div>
  );
};