import { Link } from "react-router-dom";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export const MyOrdersPage = () => {
  const { data, isLoading } = useOrders();

  const orders = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="h-7 w-36 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-100 rounded" />
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-4 w-20 bg-gray-100 rounded" />
                  <div className="h-5 w-16 bg-gray-100 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Account
            </p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">My Orders</h1>
          </div>
          <ShoppingBag className="h-6 w-6 text-gray-300" />
        </div>
      </Card>

      {/* Empty state */}
      {orders.length === 0 ? (
        <Card className="py-12 text-center">
          <div className="mx-auto max-w-xs">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
              <ShoppingBag className="h-6 w-6 text-gray-300" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              No orders yet
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Once you place an order it will appear here.
            </p>
            <div className="mt-6">
              <Link to="/shop">
                <Button size="sm">Browse catalog</Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="block">
              <Card hoverable>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-gray-900 text-sm">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <StatusBadge status={order.status} size="sm" />
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    <p className="mt-1.5 text-xs text-gray-500">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <p className="font-bold text-gray-900">
                      ₦{Number(order.totalAmount).toLocaleString()}
                    </p>
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
