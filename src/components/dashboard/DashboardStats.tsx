import { ShoppingBag, MapPin, Package, TrendingUp } from "lucide-react";
import { Card } from "../../components/ui/Card";

interface DashboardStatsProps {
  orders: any[];
  addresses: any[];
}

export const DashboardStats = ({ orders, addresses }: DashboardStatsProps) => {
  const totalOrders = orders.length;
  const totalAddresses = addresses.length;
  const completedOrders = orders.filter(o => o.status === "DELIVERED" || o.status === "COMPLETED").length;
  const pendingOrders = orders.filter(o => o.status === "PENDING" || o.status === "PROCESSING").length;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "amber",
      change: "+12%",
    },
    {
      label: "Completed",
      value: completedOrders,
      icon: Package,
      color: "green",
      change: "+8%",
    },
    {
      label: "Pending",
      value: pendingOrders,
      icon: TrendingUp,
      color: "orange",
      change: "+3%",
    },
    {
      label: "Addresses",
      value: totalAddresses,
      icon: MapPin,
      color: "purple",
      change: "+2",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "amber":
        return "bg-amber/10 text-amber";
      case "green":
        return "bg-green-500/10 text-green-600";
      case "orange":
        return "bg-orange-500/10 text-orange-600";
      case "purple":
        return "bg-purple-500/10 text-purple-600";
      default:
        return "bg-amber/10 text-amber";
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} hoverable className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className={`h-10 w-10 rounded-lg ${getColorClasses(stat.color)} flex items-center justify-center`}>
              <stat.icon size={20} />
            </div>
            {stat.change && (
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            )}
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {stat.label}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};