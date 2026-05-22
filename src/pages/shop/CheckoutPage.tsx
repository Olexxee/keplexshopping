import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useCheckout } from "../../hooks/useCheckout";
import { getErrorMessage } from "../../utils/error";
import type { CheckoutPayload } from "../../types/order.types";

export const CheckoutPage = () => {
  const { data: cart, isLoading } = useCart();
  const { mutate: submitCheckout, isPending, error } = useCheckout();

  const [form, setForm] = useState<CheckoutPayload>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCheckout(form);
  };

  const items = cart?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm uppercase tracking-wide text-gray-400">
          Checkout
        </p>
        <h1 className="text-3xl font-bold mt-1">Complete your order</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {getErrorMessage(error)}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading checkout...</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          <h2 className="text-lg font-semibold">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mt-2">
            Add items before checking out.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-5 bg-black text-white rounded-xl px-6 py-3 text-sm font-medium"
          >
            Browse catalog
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-[1fr_360px] gap-6"
        >
          {/* Customer details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold">Customer details</h2>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                name="customerEmail"
                type="email"
                value={form.customerEmail}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Phone number
              </label>
              <input
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                required
                placeholder="+234 000 000 0000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gray-400 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Delivery note
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Any extra instructions..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none outline-none focus:border-gray-400 transition"
              />
            </div>
          </div>

          {/* Summary */}
          <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
            <h2 className="text-lg font-bold">Order summary</h2>
            <div className="mt-5 space-y-4">
              {items.map((cartItem) => (
                <div
                  key={cartItem.id}
                  className="flex justify-between gap-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{cartItem.item?.name}</p>
                    <p className="text-gray-400">Qty: {cartItem.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    ₦{Number(cartItem.lineTotal).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-5 pt-5 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₦{Number(cart?.subtotal ?? 0).toLocaleString()}</span>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-5 bg-black text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {isPending ? "Processing..." : "Pay with Paystack"}
            </button>
          </aside>
        </form>
      )}
    </div>
  );
};
