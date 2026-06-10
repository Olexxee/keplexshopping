import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useCheckout } from "../../hooks/useCheckout";
import { useAddresses } from "../../hooks/useAddresses";
import { MapPin, Plus, CheckCircle } from "lucide-react";

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
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-b-brand-600" />

          <p className="mt-4 text-gray-500 font-semibold">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="py-16 text-center bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-md">
          <h2 className="mb-3 text-2xl font-bold text-primary">
            Your cart is empty
          </h2>

          <p className="mb-8 text-gray-600 text-base">
            Add some items to your cart before checking out.
          </p>

          <Link to="/shop">
            <Button size="lg" fullWidth>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white font-bold">
            1
          </div>
          <span className="font-semibold text-primary">Address</span>
        </div>
        <div className="flex-1 mx-4 h-1 bg-brand-200" />
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-200 text-brand-700 font-bold">
            2
          </div>
          <span className="font-semibold text-gray-500">Payment</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <Card className="bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-center gap-3 mb-6">
              <MapPin size={24} className="text-brand-600" />
              <h2 className="text-xl font-bold text-primary">
                Delivery Address
              </h2>
            </div>

            {addresses.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50 p-8 text-center">
                <MapPin size={40} className="mx-auto text-brand-300 mb-3" />
                <p className="mb-4 text-base text-brand-700 font-semibold">
                  No saved addresses found
                </p>

                <Link to="/account/addresses">
                  <Button variant="primary" size="lg">
                    <Plus size={18} className="mr-2" />
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
                        block cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 transform
                        ${
                          selected
                            ? "border-brand-600 bg-brand-50 ring-2 ring-brand-300 shadow-lg"
                            : "border-gray-200 hover:border-brand-300 hover:bg-brand-50/50 hover:shadow-md"
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

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <p className="font-bold text-lg text-primary">
                              {address.label}
                            </p>

                            {address.isDefault && (
                              <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
                                Default
                              </span>
                            )}
                          </div>

                          <p className="mt-3 font-semibold text-primary">
                            {address.fullName}
                          </p>

                          <p className="text-base text-gray-600 mt-1">
                            {address.phone}
                          </p>

                          <p className="mt-3 text-base text-gray-700">
                            {address.addressLine}
                          </p>

                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state}
                          </p>

                          <p className="text-sm text-gray-600">
                            {address.country}
                          </p>
                        </div>

                        {selected && (
                          <CheckCircle size={24} className="text-brand-600 flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </label>
                  );
                })}

                <Link
                  to="/account/addresses"
                  className="mt-4 inline-flex items-center gap-2 text-base font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <Plus size={18} />
                  Add new address
                </Link>
              </div>
            )}
          </Card>

          {/* Delivery Instructions */}
          <Card className="bg-gradient-to-br from-white to-gray-50">
            <h2 className="mb-5 text-xl font-bold text-primary">
              Delivery Instructions (Optional)
            </h2>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special delivery instructions (e.g., leave at gate, ring bell twice)..."
              className="
                w-full
                resize-none
                rounded-xl
                border-2
                border-gray-200
                px-4
                py-3
                text-base
                outline-none
                transition-all
                duration-200
                placeholder:text-gray-400
                focus:border-brand-400
                focus:ring-2
                focus:ring-brand-100
              "
            />
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <aside className="space-y-5">
          <Card className="h-fit bg-gradient-to-b from-white to-gray-50">
            <h2 className="mb-5 text-xl font-bold text-primary flex items-center gap-2">
              <CheckCircle size={20} className="text-brand-600" />
              Order Summary
            </h2>

            <div className="max-h-96 space-y-3.5 overflow-y-auto pr-2 mb-5 border-b border-gray-200 pb-5">
              {items.map((cartItem) => (
                <div
                  key={cartItem.id}
                  className="flex justify-between gap-3 bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-primary">
                      {cartItem.item?.name}
                    </p>

                    <p className="text-xs text-gray-600 font-medium mt-1">
                      Qty: <span className="font-bold">{cartItem.quantity}</span>
                    </p>
                  </div>

                  <p className="font-bold text-brand-600 whitespace-nowrap">
                    ₦{Number(cartItem.lineTotal).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-base">
                <span className="text-gray-700 font-medium">Subtotal</span>
                <span className="text-primary font-semibold">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-700 font-medium">Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  Total
                </span>

                <span className="text-2xl font-bold text-brand-600">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            {selectedAddress && (
              <div className="mt-6 rounded-xl bg-brand-50 border border-brand-200 p-4">
                <p className="mb-2 font-bold text-primary text-sm uppercase tracking-wide">Delivering To</p>

                <p className="font-semibold text-primary text-base">{selectedAddress.fullName}</p>

                <p className="text-gray-700 text-sm mt-2">{selectedAddress.addressLine}</p>

                <p className="text-gray-600 text-sm">
                  {selectedAddress.city}, {selectedAddress.state}
                </p>

                <p className="text-gray-600 text-sm">{selectedAddress.phone}</p>
              </div>
            )}
          </Card>

          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={checkoutDisabled}
            className="gap-2"
          >
            {redirecting
              ? "Redirecting..."
              : isPending
                ? "Processing..."
                : "Pay Now"}
          </Button>

          <div className="bg-brand-50 rounded-2xl border border-brand-200 p-4 text-center">
            <p className="text-sm font-bold text-brand-700 uppercase tracking-wide">
              🔒 Secure Payment
            </p>
            <p className="text-xs text-brand-600 mt-1">Powered by Paystack</p>
          </div>
        </aside>
      </div>
    </form>
  );
};
