import { useState } from "react";
import { useMyOrders } from "../../hooks/useOrders";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { OrderDetailModal } from "./OrderDetailModal";

export const OrdersPage = () => {
  const { data: orders, isLoading } = useMyOrders();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm uppercase tracking-wide text-gray-400">
          My orders
        </p>
        <h1 className="text-2xl font-bold mt-1">Order history</h1>
      </div>

      {isLoading && (
        <p className="text-sm text-gray-400 px-2">Loading orders...</p>
      )}

      {Array.isArray(orders) && orders.length === 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-gray-400 text-sm">No orders yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {Array.isArray(orders) && orders.map((order) => (
          <button
            key={order.id}
            onClick={() => setSelectedId(order.id)}
            className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex items-center justify-between hover:border-gray-200 hover:shadow-md transition text-left"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900 font-mono">
                #{order.id.slice(-8).toUpperCase()}
              </p>
              <p className="text-xs text-gray-400">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                {new Date(order.createdAt).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-900">
                ₦{Number(order.totalAmount).toLocaleString()}
              </span>
              <StatusBadge status={order.status} />
            </div>
          </button>
        ))}
      </div>

      <OrderDetailModal
        orderId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
};
