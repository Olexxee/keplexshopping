import { TrendingUp, TrendingDown, ShoppingBag, Users, Package, DollarSign } from "lucide-react";
import { Card } from "../ui/Card";

interface KpiCardsProps {
  overview: {
    revenue?: {
      totalRevenue?: number;
      monthRevenue?: number;
    };
    metrics?: {
      orders?: number;
      users?: number;
      items?: number;
    };
  };
}

export const KpiCards = ({ overview }: KpiCardsProps) => {
  const cards = [
    {
      title: "Revenue",
      value: `₦${Number(overview.revenue?.totalRevenue || 0).toLocaleString()}`,
      subtitle: "Total revenue",
      icon: DollarSign,
      color: "amber",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Orders",
      value: overview.metrics?.orders || 0,
      subtitle: "Total orders",
      icon: ShoppingBag,
      color: "blue",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Users",
      value: overview.metrics?.users || 0,
      subtitle: "Registered users",
      icon: Users,
      color: "purple",
      trend: "-2%",
      trendUp: false,
    },
    {
      title: "Products",
      value: overview.metrics?.items || 0,
      subtitle: "Active products",
      icon: Package,
      color: "orange",
      trend: "+5%",
      trendUp: true,
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "amber":
        return "bg-amber/10 text-amber group-hover:bg-amber/20";
      case "blue":
        return "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20";
      case "purple":
        return "bg-purple-500/10 text-purple-600 group-hover:bg-purple-500/20";
      case "orange":
        return "bg-orange-500/10 text-orange-600 group-hover:bg-orange-500/20";
      default:
        return "bg-amber/10 text-amber group-hover:bg-amber/20";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => (
        <Card key={card.title} hoverable className="p-6 group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>
              <p className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-2">
                {card.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {card.subtitle}
              </p>
              {card.trend && (
                <div className={`flex items-center gap-1 mt-2 ${
                  card.trendUp ? "text-green-600" : "text-red-600"
                }`}>
                  {card.trendUp ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  <span className="text-xs font-medium">
                    {card.trend}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    vs last month
                  </span>
                </div>
              )}
            </div>
            <div className={`h-12 w-12 rounded-lg ${getColorClasses(card.color)} flex items-center justify-center transition-colors shrink-0 ml-4`}>
              <card.icon size={24} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};