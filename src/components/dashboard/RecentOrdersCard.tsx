import { useNavigate } from "react-router-dom";
import { Package, Truck, CheckCircle, Clock, ArrowRight, ShoppingBag } from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import type { Order } from "../../types/order.types";

interface Props {
  orders: Order[];
}

const getStatusIcon = (status: string) => {
  switch (status?.toUpperCase()) {
    case "DELIVERED":
    case "COMPLETED":
      return <CheckCircle size={14} className="text-green-600" />;
    case "SHIPPED":
      return <Truck size={14} className="text-blue-600" />;
    case "PENDING":
    case "PROCESSING":
      return <Clock size={14} className="text-orange-600" />;
    default:
      return <Package size={14} className="text-amber" />;
  }
};

export const RecentOrdersCard = ({ orders }: Props) => {
  const navigate = useNavigate();

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const hasOrders = recentOrders.length > 0;

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-display-sm text-foreground">
          Recent Orders
        </h2>
        {hasOrders && (
          <button
            onClick={() => navigate("/orders")}
            className="text-sm font-medium text-amber hover:text-amber-light transition-colors flex items-center gap-1 group"
          >
            View All
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {!hasOrders ? (
        <div className="text-center py-8">
          <div className="h-12 w-12 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag size={24} className="text-amber" />
          </div>
          <p className="text-sm text-muted-foreground mb-3">No orders yet</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/shop")}
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:border-amber/30 hover:shadow-md transition-all duration-200 group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-foreground">
                    #{order.id.slice(-8)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-amber">
                  ₦{Number(order.totalAmount).toLocaleString()}
                </span>
                <StatusBadge status={order.status} />
              </div>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
};