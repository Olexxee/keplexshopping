import type { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { Modal } from "../../components/ui/Modal";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useOrderById } from "../../hooks/useOrders";

interface Props {
  orderId: string | null;
  onClose: () => void;
}

export const OrderDetailModal = ({ orderId, onClose }: Props) => {
  const { data: order, isLoading } = useOrderById(orderId ?? "");

  return (
    <Modal
      open={!!orderId}
      onClose={onClose}
      title="Order detail"
      width="max-w-xl"
    >
      {isLoading && (
        <p className="text-sm text-gray-400 text-center py-8">Loading...</p>
      )}

      {order && (
        <div className="space-y-5">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-mono">
              #{order.id.slice(-8).toUpperCase()}
            </span>
            <StatusBadge status={order.status} />
          </div>

          {/* Items */}
          <div className="divide-y divide-gray-50">
            {order.items.map((item: { id: Key | null | undefined; item: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; quantity: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; unitPriceSnapshot: any; totalPrice: any; }) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.item.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.quantity} × ₦
                    {Number(item.unitPriceSnapshot).toLocaleString()}
                  </p>
                  // Total per line: ₦{Number(item.totalPrice).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-lg font-bold text-gray-900">
              ₦{Number(order.totalAmount).toLocaleString()}
            </span>
          </div>

          {/* Date */}
          <p className="text-xs text-gray-400">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      )}
    </Modal>
  );
};
