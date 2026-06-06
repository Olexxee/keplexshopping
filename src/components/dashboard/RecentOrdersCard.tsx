import { useNavigate } from "react-router-dom";
import { StatusBadge } from "../ui/StatusBadge";
import type { Order } from "../../types/order.types";

interface Props {
  orders: Order[];
}

export const RecentOrdersCard = ({ orders }: Props) => {
  const navigate = useNavigate();

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6">
      <h2 className="font-semibold text-lg mb-5">Recent Orders</h2>

      {recentOrders.length === 0 ? (
        <p className="text-sm text-slate-400">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => navigate("/orders")}
              className="w-full flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition"
            >
              <div className="text-left">
                <p className="font-mono text-sm font-medium">
                  #{order.id.slice(-8)}
                </p>

                <p className="text-xs text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-semibold">
                  ₦{Number(order.totalAmount).toLocaleString()}
                </span>

                <StatusBadge status={order.status} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
