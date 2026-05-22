import { Link } from "react-router-dom";
import { useMyOrders } from "../../hooks/useOrders";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { getErrorMessage } from "../../utils/error";

export const MyOrdersPage = () => {
  const { data: orders, isLoading, error } = useMyOrders();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm uppercase tracking-wide text-gray-400">Orders</p>
        <h1 className="text-3xl font-bold mt-1">My Orders</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {getErrorMessage(error)}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading orders...</p>
      ) : !orders?.length ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          <h2 className="text-lg font-semibold">No orders yet</h2>
          <p className="text-gray-400 text-sm mt-2">
            Your orders will appear here after checkout.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-5 bg-black text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-gray-800 transition"
          >
            Browse catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Order ID
                  </p>
                  <h2 className="font-semibold font-mono text-sm mt-0.5">
                    #{order.id.slice(-10).toUpperCase()}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <Link
                    to={`/orders/${order.id}`}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition"
                  >
                    View
                  </Link>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-5 text-sm">
                <div>
                  <p className="text-gray-400">Customer</p>
                  <p className="font-medium mt-0.5">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total</p>
                  <p className="font-medium mt-0.5">
                    ₦{Number(order.totalAmount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Placed</p>
                  <p className="font-medium mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
