import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, RotateCcw, XCircle } from "lucide-react";

import { useOrder } from "../../hooks/useOrder";
import { useCancelOrder } from "../../hooks/useCancelOrder";
import { initializePayment } from "../../api/payment.api";

import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";

import { getErrorMessage } from "../../utils/error";
import type { OrderStatus } from "../../types/order.types";

const CANCELLABLE: OrderStatus[] = ["PENDING", "CONFIRMED"];

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useOrder(id);
  const { mutate: cancelOrder, isPending: cancelling } = useCancelOrder();

  const [showCancel, setShowCancel] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const canCancel =
    !!order && CANCELLABLE.includes(order.status as OrderStatus);

  const failedPayment = order?.payments?.find((p) => p.status === "FAILED");

  const handlePayAgain = async () => {
    if (!order) return;
    try {
      setRetrying(true);
      const payment = await initializePayment(order.id);
      window.location.href = payment.authorizationUrl!;
    } catch (err) {
      setRetrying(false);
      alert(getErrorMessage(err));
    }
  };

  const handleConfirmCancel = () => {
    if (!id) return;
    cancelOrder(id, {
      onSuccess: () => setShowCancel(false),
      onError: (err) => alert(getErrorMessage(err)),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
          <p className="mt-4 text-gray-400">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <Card className="py-12 text-center">
        <p className="text-gray-500">Order not found.</p>
        <div className="mt-4">
          <Link to="/orders">
            <Button variant="secondary" size="sm">
              Back to orders
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <>
      <ConfirmDialog
        open={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmLabel="Yes, cancel order"
        isPending={cancelling}
        variant="danger"
      />

      <div className="space-y-6">
        {/* Header */}
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                to="/orders"
                className="text-xs text-gray-400 hover:text-gray-600 transition"
              >
                ← My orders
              </Link>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">
                Order #{order.id.slice(-8).toUpperCase()}
              </h1>
              <div className="mt-2 flex items-center gap-3">
                <StatusBadge status={order.status} />
                <span className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              {failedPayment && (
                <Button size="sm" onClick={handlePayAgain} disabled={retrying}>
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  {retrying ? "Redirecting..." : "Pay again"}
                </Button>
              )}

              {canCancel && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowCancel(true)}
                  disabled={cancelling}
                >
                  <XCircle className="mr-1.5 h-3.5 w-3.5" />
                  Cancel order
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left — items */}
          <div className="space-y-6">
            <Card>
              <h2 className="mb-4 text-base font-semibold text-gray-900">
                Items ordered
              </h2>

              <div className="divide-y divide-gray-50">
                {order.items.map((item) => {
                  const image = item.item?.media?.[0]?.url;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {image ? (
                          <img
                            src={image}
                            alt={item.item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-300">
                            —
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {item.item.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          ₦{Number(item.unitPriceSnapshot).toLocaleString()} ×{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-900 text-sm shrink-0">
                        ₦{Number(item.totalPrice).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">
                  ₦{Number(order.totalAmount).toLocaleString()}
                </span>
              </div>
            </Card>

            {/* Payment history */}
            {order.payments && order.payments.length > 0 && (
              <Card>
                <h2 className="mb-4 text-base font-semibold text-gray-900">
                  Payment history
                </h2>

                <div className="divide-y divide-gray-50">
                  {order.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.reference}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Paystack</p>
                      </div>
                      <StatusBadge status={payment.status} size="sm" />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right — address + notes */}
          <div className="space-y-6">
            {order.address && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Delivery address
                  </h2>
                </div>

                <div className="text-sm space-y-1">
                  <p className="font-medium text-gray-900">
                    {order.address.fullName}
                  </p>
                  <p className="text-gray-500">{order.address.phone}</p>
                  <p className="text-gray-600 mt-2">
                    {order.address.addressLine}
                  </p>
                  <p className="text-gray-500">
                    {order.address.city}, {order.address.state}
                  </p>
                  <p className="text-gray-500">{order.address.country}</p>
                </div>
              </Card>
            )}

            {order.notes && (
              <Card>
                <h2 className="mb-2 text-base font-semibold text-gray-900">
                  Delivery instructions
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {order.notes}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
