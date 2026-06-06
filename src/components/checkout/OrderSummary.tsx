import type { Cart } from "../../types/cart.types";

interface Props {
  cart: Cart;
  isSubmitting: boolean;
}

export const OrderSummary = ({ cart, isSubmitting }: Props) => {
  return (
    <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
      <h2 className="text-lg font-bold">Order Summary</h2>

      <div className="mt-5 space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between gap-3">
            <div>
              <p className="font-medium">{item.item.name}</p>

              <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
            </div>

            <p className="font-semibold">
              ₦{Number(item.lineTotal).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t mt-5 pt-5 flex justify-between text-lg font-bold">
        <span>Total</span>

        <span>₦{Number(cart.subtotal).toLocaleString()}</span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-5 bg-black text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {isSubmitting ? "Processing..." : "Pay with Paystack"}
      </button>
    </aside>
  );
};
