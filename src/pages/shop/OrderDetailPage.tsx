import { Link, useParams } from "react-router-dom";
import { useOrderById } from "../../hooks/useOrders";
import { useInitializePayment } from "../../hooks/usePayment";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { getErrorMessage } from "../../utils/error";

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useOrderById(id ?? "");
  const { mutate: payNow, isPending: paymentLoading } = useInitializePayment();

  return (
    <div className="space-y-6">
      <Link
        to="/orders"
        className="text-sm text-gray-500 hover:text-gray-900 transition inline-block"
      >
        ← Back to orders
      </Link>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {getErrorMessage(error)}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading order...</p>
      ) : !order ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          <h2 className="text-lg font-semibold">Order not found</h2>
        </div>
      ) : (
        <>
          {/* Header card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-400">
                  Order detail
                </p>
                <h1 className="text-2xl font-bold mt-1 font-mono">
                  #{order.id.slice(-10).toUpperCase()}
                </h1>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-6 text-sm">
              <div>
                <p className="text-gray-400">Customer</p>
                <p className="font-medium mt-0.5">{order.customerName}</p>
              </div>
              {order.customerPhone && (
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="font-medium mt-0.5">{order.customerPhone}</p>
                </div>
              )}
              {order.customerEmail && (
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="font-medium mt-0.5">{order.customerEmail}</p>
                </div>
              )}
            </div>

            {order.notes && (
              <div className="mt-5 bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Notes
                </p>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Items card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold mb-5">Items</h2>

            <div className="space-y-4">
              {order.items?.map((orderItem) => {
                const image = orderItem.item?.media?.[0]?.url;
                return (
                  <div
                    key={orderItem.id}
                    className="flex gap-4 border-b border-gray-50 last:border-b-0 pb-4 last:pb-0"
                  >
                    <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      {image ? (
                        <img
                          src={image}
                          alt={orderItem.item?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">
                        {orderItem.item?.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {orderItem.quantity} × ₦
                        {Number(orderItem.unitPriceSnapshot).toLocaleString()}
                      </p>
                    </div>
                    <p className="font-bold text-sm self-center">
                      ₦{Number(orderItem.totalPrice).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100 mt-5 pt-5 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₦{Number(order.totalAmount).toLocaleString()}</span>
            </div>

            {order.status === "PENDING" && (
              <button
                onClick={() =>
                  payNow(order.id, {
                    onError: (err) => alert(getErrorMessage(err)),
                  })
                }
                disabled={paymentLoading}
                className="w-full mt-5 bg-black text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
              >
                {paymentLoading ? "Processing..." : "Pay now"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
