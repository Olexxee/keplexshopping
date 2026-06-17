import { Link } from "react-router-dom";
import { TrendingUp, Package, ChevronRight, Award, Star, Crown } from "lucide-react";
import { Card } from "../ui/Card";

interface TopItem {
  item?: {
    id: string;
    name: string;
    price?: number;
    image?: string;
  };
  quantitySold: number;
  revenue?: number;
}

interface TopItemsProps {
  items: TopItem[];
  showViewAll?: boolean;
}

const getRankIcon = (index: number) => {
  switch (index) {
    case 0:
      return <Crown size={14} className="text-yellow-500" />;
    case 1:
      return <Award size={14} className="text-gray-400" />;
    case 2:
      return <Award size={14} className="text-amber-600" />;
    default:
      return null;
  }
};

const getRankStyles = (index: number) => {
  switch (index) {
    case 0:
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case 1:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    case 2:
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const TopItems = ({ items, showViewAll = true }: TopItemsProps) => {
  if (!items || items.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-display-sm text-foreground">Top Selling Products</h2>
          <div className="h-8 w-8 rounded-full bg-muted/30 flex items-center justify-center">
            <TrendingUp size={16} className="text-muted-foreground" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
            <Package size={24} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No sales data available</p>
          <p className="text-xs text-muted-foreground mt-1">
            Sales data will appear here once you start selling.
          </p>
        </div>
      </Card>
    );
  }

  const topItems = items.slice(0, 5);
  const maxSold = topItems[0]?.quantitySold || 1;

  return (
    <Card className="p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-amber/10 flex items-center justify-center">
            <TrendingUp size={16} className="text-amber" />
          </div>
          <h2 className="font-display text-display-sm text-foreground">Top Selling Products</h2>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted/30 px-2.5 py-0.5 rounded-full">
          {topItems.length} items
        </span>
      </div>

      <div className="space-y-2">
        {topItems.map((entry, index) => {
          const rankIcon = getRankIcon(index);
          const rankStyles = getRankStyles(index);
          const percentage = (entry.quantitySold / maxSold) * 100;

          return (
            <Link
              key={entry.item?.id || index}
              to={`/admin/items/${entry.item?.id}`}
              className="block p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className={`flex items-center justify-center w-7 h-7 rounded-full ${rankStyles} shrink-0`}>
                  {rankIcon || (
                    <span className="text-xs font-bold">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Product Image/Icon */}
                <div className="h-10 w-10 rounded-lg bg-muted/30 overflow-hidden shrink-0">
                  {entry.item?.image ? (
                    <img
                      src={entry.item.image}
                      alt={entry.item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-amber/5">
                      <Package size={16} className="text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-amber transition-colors">
                    {entry.item?.name || "Unknown Product"}
                  </p>
                  {entry.revenue && (
                    <p className="text-xs text-muted-foreground">
                      ₦{entry.revenue.toLocaleString()} revenue
                    </p>
                  )}
                </div>

                {/* Sales Count */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {entry.quantitySold}
                    </p>
                    <p className="text-xs text-muted-foreground">sold</p>
                  </div>
                  <div className="w-16">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-amber transition-all"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-muted-foreground group-hover:text-amber group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {showViewAll && items.length > 5 && (
        <div className="mt-4 pt-4 border-t border-border">
          <Link
            to="/admin/analytics/top-products"
            className="flex items-center justify-center gap-1 text-sm font-medium text-amber hover:text-amber-light transition-colors group"
          >
            View All Products
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}
    </Card>
  );
};