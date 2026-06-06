import { useParams, Link } from "react-router-dom";
import { MapPin, User, Phone, Mail, ChevronRight } from "lucide-react";

import { useOrder } from "../../hooks/useOrder";
import { useUpdateOrderStatus } from "../../hooks/useAdminOrders";

import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";

import { getErrorMessage } from "../../utils/error";
import type { OrderStatus } from "../../types/order.types";
import { useState } from "react";

// Linear progression — each status maps to the next one
const STATUS_PROGRESSION: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PROCESSING",
  PROCESSING: "COMPLETED",
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  PENDING: "Confirm order",
  CONFIRMED: "Mark as processing",
  PROCESSING: "Mark as completed",
};

const CANCELLABLE: OrderStatus[] = ["PENDING", "CONFIRMED"];

export const AdminOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useOrder(id);
  const { mutate: updateStatus, isPending: updating } = useUpdateOrderStatus();

  const [confirmNext, setConfirmNext] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const currentStatus = order?.status as OrderStatus | undefined;
  const nextStatus = currentStatus
    ? STATUS_PROGRESSION[currentStatus]
    : undefined;
  const nextLabel = currentStatus ? NEXT_LABEL[currentStatus] : undefined;
  const canCancel = !!currentStatus && CANCELLABLE.includes(currentStatus);

  const handleAdvance = () => {
    if (!id || !nextStatus) return;
    updateStatus(
      { id, status: nextStatus },
      {
        onSuccess: () => setConfirmNext(false),
        onError: (err) => alert(getErrorMessage(err)),
      },
    );
  };

  const handleCancel = () => {
    if (!id) return;
    updateStatus(
      { id, status: "CANCELLED" },
      {
        onSuccess: () => setConfirmCancel(false),
        onError: (err) => alert(getErrorMessage(err)),
      },
    );
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
          <Link to="/admin/orders">
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
      {/* Advance status confirmation */}
      <ConfirmDialog
        open={confirmNext}
        onClose={() => setConfirmNext(false)}
        onConfirm={handleAdvance}
        title={nextLabel ?? "Update status"}
        message={`Move this order from ${currentStatus} to ${nextStatus}?`}
        confirmLabel="Yes, update"
        isPending={updating}
      />

      {/* Cancel confirmation */}
      <ConfirmDialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        onConfirm={handleCancel}
        title="Cancel order"
        message="Are you sure you want to cancel this order? This cannot be undone."
        confirmLabel="Yes, cancel order"
        isPending={updating}
        variant="danger"
      />

      <div className="space-y-6">
        {/* Header */}
        <Card>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Link
                to="/admin/orders"
                className="text-xs text-gray-400 hover:text-gray-600 transition"
              >
                ← All orders
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

            {/* Status controls */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {nextStatus && nextLabel && (
                <Button
                  size="sm"
                  onClick={() => setConfirmNext(true)}
                  disabled={updating}
                >
                  {nextLabel}
                  <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              )}

              {canCancel && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirmCancel(true)}
                  disabled={updating}
                >
                  Cancel order
                </Button>
              )}
            </div>
          </div>

          {/* Status pipeline */}
          <div className="mt-6 flex items-center gap-1">
            {(
              [
                "PENDING",
                "CONFIRMED",
                "PROCESSING",
                "COMPLETED",
              ] as OrderStatus[]
            ).map((step, i, arr) => {
              const statuses: OrderStatus[] = [
                "PENDING",
                "CONFIRMED",
                "PROCESSING",
                "COMPLETED",
              ];
              const currentIdx = statuses.indexOf(order.status as OrderStatus);
              const stepIdx = statuses.indexOf(step);
              const done = stepIdx <= currentIdx;
              const isCancelled = order.status === "CANCELLED";

              return (
                <div key={step} className="flex items-center gap-1 flex-1">
                  <div className="flex-1">
                    <div
                      className={`h-1.5 rounded-full transition-colors ${
                        isCancelled
                          ? "bg-red-200"
                          : done
                            ? "bg-gray-900"
                            : "bg-gray-100"
                      }`}
                    />
                    <p
                      className={`mt-1.5 text-xs ${
                        done && !isCancelled
                          ? "text-gray-700 font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {step.charAt(0) + step.slice(1).toLowerCase()}
                    </p>
                  </div>
                  {i < arr.length - 1 && <div className="w-2 shrink-0" />}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Order items */}
            <Card>
              <h2 className="mb-4 text-base font-semibold text-gray-900">
                Items
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
                        <p className="text-sm font-medium text-gray-900 font-mono">
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

          {/* Right column */}
          <div className="space-y-6">
            {/* Customer info */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4 text-gray-400" />
                <h2 className="text-base font-semibold text-gray-900">
                  Customer
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <p className="font-medium text-gray-900">
                  {order.customerName}
                </p>

                {order.customerEmail && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span>{order.customerEmail}</span>
                  </div>
                )}

                {order.customerPhone && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{order.customerPhone}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Shipping address */}
            {order.address && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Shipping address
                  </h2>
                </div>

                <div className="space-y-1 text-sm">
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

            {/* Notes */}
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
