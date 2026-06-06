import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, MapPin } from "lucide-react";

import { useOrder } from "../../hooks/useOrder";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") ?? undefined;

  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
          <p className="mt-4 text-gray-400">Loading your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      {/* Icon + heading */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle className="h-8 w-8 text-green-600" strokeWidth={1.5} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Payment successful</h1>

        <p className="mt-2 text-sm text-gray-500">
          Your order has been confirmed and is being processed.
        </p>
      </div>

      {/* Order details card */}
      <Card className="mb-4">
        <p className="mb-4 text-sm font-medium text-gray-500">Order details</p>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order number</span>
            <span className="font-medium text-gray-900">
              #{order?.payments?.[0]?.reference ?? "—"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span className="text-gray-900">
              {order?.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment method</span>
            <span className="text-gray-900">Paystack</span>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total paid</span>
              <span className="font-semibold text-gray-900">
                ₦{Number(order?.totalAmount ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Delivery address */}
      {order?.address && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3">
          <MapPin
            className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
            strokeWidth={1.5}
          />

          <div>
            <p className="text-sm font-medium text-gray-900">Delivering to</p>

            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              {order.address.fullName} · {order.address.addressLine}
              <br />
              {order.address.city}, {order.address.state}
            </p>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="space-y-3">
        <Link to="/orders">
          <Button size="lg" fullWidth>
            View my orders
          </Button>
        </Link>

        <Link to="/shop">
          <Button size="lg" fullWidth variant="outline">
            Continue shopping
          </Button>
        </Link>
      </div>

      <p className="mt-5 text-center text-xs text-gray-400">
        A confirmation email has been sent to your inbox.
      </p>
    </div>
  );
};
