import { Link } from "react-router-dom";

export const RecentOrdersTable = ({ orders }: { orders: any[] }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-semibold text-lg text-gray-900 mb-4">
          Recent Orders
        </h2>
        <p className="text-gray-400 text-sm text-center py-8">
          No recent orders
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="font-semibold text-lg text-gray-900 mb-4">
        Recent Orders
      </h2>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/admin/orders/${order.id}`}
            className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
          >
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {order.customerName || order.user?.fullName || "Guest"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                #{order.id?.slice(-8).toUpperCase()}
              </p>
            </div>
            <span className="font-semibold text-gray-900">
              ₦{Number(order.totalAmount).toLocaleString()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
