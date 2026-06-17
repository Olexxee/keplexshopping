import { Link } from "react-router-dom";
import { Package, ChevronRight, User, Calendar, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { Card } from "../ui/Card";

interface Order {
  id: string;
  orderNumber?: string;
  customerName?: string;
  user?: { fullName: string };
  totalAmount: number;
  status?: string;
  createdAt?: string;
}

interface RecentOrdersTableProps {
  orders: Order[];
}

const getStatusConfig = (status: string) => {
  const statusMap: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    PENDING: {
      label: "Pending",
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    PROCESSING: {
      label: "Processing",
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    SHIPPED: {
      label: "Shipped",
      icon: Truck,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    DELIVERED: {
      label: "Delivered",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    CANCELLED: {
      label: "Cancelled",
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900/30",
    },
  };
  return statusMap[status?.toUpperCase()] || {
    label: status || "Unknown",
    icon: Package,
    color: "text-muted-foreground",
    bg: "bg-muted/30",
  };
};

export const RecentOrdersTable = ({ orders }: RecentOrdersTableProps) => {
  if (!orders || orders.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="font-display text-display-sm text-foreground mb-4">Recent Orders</h2>
        <div className="flex flex-col items-center py-8">
          <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
            <Package size={24} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No recent orders</p>
        </div>
      </Card>
    );
  }

  const recentOrders = orders.slice(0, 5);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-display-sm text-foreground">Recent Orders</h2>
        <Link to="/admin/orders" className="text-xs font-medium text-amber hover:text-amber-light transition-colors">
          View All →
        </Link>
      </div>
      <div className="space-y-3">
        {recentOrders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;
          const customerName = order.customerName || order.user?.fullName || "Guest";
          const orderNumber = order.orderNumber || order.id?.slice(-8).toUpperCase() || "N/A";

          return (
            <Link
              key={order.id}
              to={`/admin/orders/${order.id}`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group"
            >
              {/* Order Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-foreground group-hover:text-amber transition-colors">
                    {customerName}
                  </p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                    <StatusIcon size={10} />
                    {statusConfig.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-xs text-muted-foreground font-mono">
                    #{orderNumber}
                  </p>
                  {order.createdAt && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-3">
                <p className="font-display font-semibold text-amber text-sm">
                  ₦{Number(order.totalAmount).toLocaleString()}
                </p>
                <ChevronRight 
                  size={16} 
                  className="text-muted-foreground group-hover:text-amber group-hover:translate-x-0.5 transition-all" 
                />
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};