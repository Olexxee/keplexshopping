import { Clock, Package, Truck, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface OrderStatusCardsProps {
  statusCounts: Record<string, number>;
  totalOrders?: number;
}

export const OrderStatusCards = ({ statusCounts, totalOrders }: OrderStatusCardsProps) => {
  if (!statusCounts || Object.keys(statusCounts).length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center">
            <AlertCircle size={24} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No order data available</p>
            <p className="text-xs text-muted-foreground mt-1">
              Orders will appear here once placed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    PENDING: {
      label: "Pending",
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-500/10 group-hover:bg-orange-500/20",
    },
    CONFIRMED: {
      label: "Confirmed",
      icon: CheckCircle,
      color: "text-blue-500",
      bg: "bg-blue-500/10 group-hover:bg-blue-500/20",
    },
    PROCESSING: {
      label: "Processing",
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-500/10 group-hover:bg-purple-500/20",
    },
    SHIPPED: {
      label: "Shipped",
      icon: Truck,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
    },
    COMPLETED: {
      label: "Completed",
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10 group-hover:bg-green-500/20",
    },
    CANCELLED: {
      label: "Cancelled",
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10 group-hover:bg-red-500/20",
    },
  };

  const priority = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];
  const sortedStatuses = Object.entries(statusCounts).sort(
    (a, b) => priority.indexOf(a[0]) - priority.indexOf(b[0])
  );

  const total = totalOrders || sortedStatuses.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {sortedStatuses.map(([status, count]) => {
        const config = statusConfig[status] || {
          label: status,
          icon: AlertCircle,
          color: "text-muted-foreground",
          bg: "bg-muted/30 group-hover:bg-muted/50",
        };
        const Icon = config.icon;
        const percentage = total > 0 ? (count / total) * 100 : 0;

        return (
          <div
            key={status}
            className="bg-card rounded-xl border border-border p-4 text-center transition-all hover:shadow-md group"
          >
            <div className="flex flex-col items-center">
              <div className={`h-10 w-10 rounded-lg ${config.bg} flex items-center justify-center transition-colors mb-2`}>
                <Icon size={18} className={config.color} />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">
                {count}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {config.label}
              </p>
              <div className="w-full mt-2">
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${percentage > 0 ? 'bg-amber' : ''}`}
                    style={{ width: `${Math.max(percentage, 0)}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};