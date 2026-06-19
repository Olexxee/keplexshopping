import { ShoppingBag, MapPin, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "../ui/Card";

interface AccountStatsProps {
  ordersCount: number;
  addressesCount: number;
  ordersTrend?: number;
  addressesTrend?: number;
}

export const AccountStats = ({
  ordersCount,
  addressesCount,
  ordersTrend = 0,
  addressesTrend = 0,
}: AccountStatsProps) => {
  const stats = [
    {
      label: "Orders",
      value: ordersCount,
      icon: ShoppingBag,
      trend: ordersTrend,
    },
    {
      label: "Addresses",
      value: addressesCount,
      icon: MapPin,
      trend: addressesTrend,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} hoverable className="p-6 group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="h-10 w-10 rounded-lg bg-amber/10 flex items-center justify-center group-hover:bg-amber/20 transition-colors mb-3">
                <stat.icon size={20} className="text-amber" />
              </div>
              <p className="font-display text-3xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </p>
            </div>
            {stat.trend !== undefined && stat.trend !== 0 && (
              <div className={`flex items-center gap-1 text-xs font-medium ${
                stat.trend > 0 ? "text-green-600" : "text-red-600"
              }`}>
                {stat.trend > 0 ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                <span>{Math.abs(stat.trend)}%</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};