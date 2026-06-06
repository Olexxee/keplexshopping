import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useCheckout } from "../../hooks/useCheckout";
import { useAddresses } from "../../hooks/useAddresses";

import { initializePayment } from "../../api/payment.api";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

import { getErrorMessage } from "../../utils/error";

export const CheckoutPage = () => {
  const { data: cart, isLoading: cartLoading } = useCart();

  const { data: addresses = [], isLoading: addressesLoading } = useAddresses();

  const { mutate: submitCheckout, isPending } = useCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [notes, setNotes] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  const items = cart?.items ?? [];
  const subtotal = Number(cart?.subtotal ?? 0);

  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId,
  );

  const isSubmitting = isPending || redirecting;

  const checkoutDisabled =
    isSubmitting ||
    addresses.length === 0 ||
    !selectedAddressId ||
    items.length === 0;

  useEffect(() => {
    const defaultAddress = addresses.find((address) => address.isDefault);

    if (defaultAddress && !selectedAddressId) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, [addresses, selectedAddressId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAddressId) return;

    submitCheckout(
      {
        addressId: selectedAddressId,
        notes,
      },
      {
        onSuccess: async ({ order }) => {
          try {
            setRedirecting(true);

            const payment = await initializePayment(order.id);

            window.location.href = payment.authorizationUrl;
          } catch (error) {
            setRedirecting(false);
            alert(getErrorMessage(error));
          }
        },

        onError: (error) => {
          alert(getErrorMessage(error));
        },
      },
    );
  };

  if (cartLoading || addressesLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />

          <p className="mt-4 text-gray-400">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="py-12 text-center">
        <div className="mx-auto max-w-md">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Your cart is empty
          </h2>

          <p className="mb-6 text-gray-500">
            Add some items to your cart before checking out.
          </p>

          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <Card>
            <h2 className="mb-5 text-lg font-semibold text-gray-900">
              Delivery Address
            </h2>

            {addresses.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
                <p className="mb-4 text-sm text-gray-500">
                  You don't have any saved addresses.
                </p>

                <Link to="/account/addresses">
                  <Button variant="primary" size="sm">
                    Add Address
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => {
                  const selected = selectedAddressId === address.id;

                  return (
                    <label
                      key={address.id}
                      className={`
                        block cursor-pointer rounded-xl border p-4 transition-all duration-200
                        ${
                          selected
                            ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        className="hidden"
                        checked={selected}
                        onChange={() => setSelectedAddressId(address.id)}
                      />

                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-gray-900">
                              {address.label}
                            </p>

                            {address.isDefault && (
                              <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs text-white">
                                Default
                              </span>
                            )}
                          </div>

                          <p className="mt-2 font-medium text-gray-900">
                            {address.fullName}
                          </p>

                          <p className="text-sm text-gray-500">
                            {address.phone}
                          </p>

                          <p className="mt-2 text-sm text-gray-600">
                            {address.addressLine}
                          </p>

                          <p className="text-sm text-gray-500">
                            {address.city}, {address.state}
                          </p>

                          <p className="text-sm text-gray-500">
                            {address.country}
                          </p>
                        </div>

                        {selected && (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}

                <Link
                  to="/account/addresses"
                  className="mt-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
                >
                  <span>+</span>
                  Add new address
                </Link>
              </div>
            )}
          </Card>

          {/* Delivery Instructions */}
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Delivery Instructions
            </h2>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special delivery instructions..."
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                text-sm
                outline-none
                transition-all
                duration-200
                placeholder:text-gray-400
                focus:border-gray-400
                focus:ring-1
                focus:ring-gray-400
              "
            />
          </Card>
        </div>

        {/* Right Column */}
        <aside className="space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Order Summary
            </h2>

            <div className="max-h-80 space-y-4 overflow-y-auto">
              {items.map((cartItem) => (
                <div
                  key={cartItem.id}
                  className="flex justify-between gap-3 text-sm"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {cartItem.item?.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      Qty: {cartItem.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    ₦{Number(cartItem.lineTotal).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-4 border-t border-gray-200" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-bold text-gray-900">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            {selectedAddress && (
              <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm">
                <p className="mb-2 font-medium text-gray-900">Delivering To</p>

                <p className="text-gray-700">{selectedAddress.fullName}</p>

                <p className="text-gray-600">{selectedAddress.addressLine}</p>

                <p className="text-gray-500">
                  {selectedAddress.city}, {selectedAddress.state}
                </p>

                <p className="text-gray-500">{selectedAddress.phone}</p>
              </div>
            )}
          </Card>

          <Button type="submit" size="lg" fullWidth disabled={checkoutDisabled}>
            {redirecting
              ? "Redirecting to Paystack..."
              : isPending
                ? "Processing..."
                : "Pay with Paystack"}
          </Button>

          <p className="text-center text-xs text-gray-400">
            🔒 Secure payment powered by Paystack
          </p>
        </aside>
      </div>
    </form>
  );
};
