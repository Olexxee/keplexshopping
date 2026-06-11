import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight } from "lucide-react";

import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "../../hooks/useCart";

import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";

import { getErrorMessage } from "../../utils/error";

const CartSkeleton = () => (
  <div className="grid lg:grid-cols-[1fr_400px] gap-8">
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-5 animate-pulse"
        >
          <div className="w-32 h-32 rounded-xl bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 w-40 bg-gray-200 rounded-lg" />
            <div className="h-3 w-24 bg-gray-200 rounded-lg" />
            <div className="h-8 w-32 bg-gray-200 rounded-full mt-4" />
          </div>
        </div>
      ))}
    </div>
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl border border-gray-100 shadow-sm p-6 h-fit animate-pulse space-y-4">
      <div className="h-5 w-32 bg-gray-200 rounded-lg" />
      <div className="h-4 w-full bg-gray-200 rounded-lg" />
      <div className="h-4 w-full bg-gray-200 rounded-lg" />
      <div className="h-10 w-full bg-gray-200 rounded-xl mt-6" />
    </div>
  </div>
);

export const CartPage = () => {
  const { data: cart, isLoading, error } = useCart();
  const {
    mutate: updateItem,
    isPending: updatePending,
    variables: updateVars,
  } = useUpdateCartItem();
  const {
    mutate: removeItem,
    isPending: removePending,
    variables: removeVars,
  } = useRemoveCartItem();
  const { mutate: clearCart, isPending: clearPending } = useClearCart();

  const items = cart?.items ?? [];
  const actionLoading = updatePending || removePending || clearPending;

  const handleQuantityChange = (itemId: string, next: number) => {
    if (next < 1) return;
    updateItem(
      { itemId, quantity: next },
      { onError: (err) => alert(getErrorMessage(err)) },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8 py-8">
        <PageHeader label="Shopping Bag" title="Your Cart" />
        <CartSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <PageHeader
        label="Shopping Bag"
        title="Your Cart"
        action={
          items.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                clearCart(undefined, {
                  onError: (err) => alert(getErrorMessage(err)),
                })
              }
              disabled={clearPending}
            >
              {clearPending ? "Clearing..." : "Clear cart"}
            </Button>
          ) : undefined
        }
      />

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 text-sm rounded-2xl px-6 py-4 font-semibold">
          {getErrorMessage(error)}
        </div>
      )}

      {items.length === 0 ? (
        <Card className="py-16 text-center bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
              <ShoppingCart className="h-10 w-10 text-brand-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary">
              Your cart is empty
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Start shopping and add items to your cart!
            </p>
            <div className="mt-8">
              <Link to="/shop">
                <Button size="lg" fullWidth>
                  <ShoppingCart size={18} className="mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Items */}
          <div className="space-y-4">
            {items.map((cartItem) => {
              const image = cartItem.item?.media?.[0]?.url;
              const isUpdatingThis =
                updatePending && updateVars?.itemId === cartItem.itemId;
              const isRemovingThis =
                removePending && removeVars === cartItem.itemId;

              return (
                <article
                  key={cartItem.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 p-5 flex gap-5"
                >
                  <div className="w-32 h-32 rounded-xl bg-gray-100 overflow-hidden shrink-0 ring-2 ring-gray-100">
                    {image ? (
                      <img
                        src={image}
                        alt={cartItem.item?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-gray-300 bg-gray-50">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between gap-4">
                      <div className="min-w-0">
                        <Link to={`/shop/${cartItem.itemId}`}>
                          <h2 className="font-bold text-base text-primary hover:text-brand-600 transition-colors truncate">
                            {cartItem.item?.name}
                          </h2>
                        </Link>
                        <p className="text-sm text-brand-600 font-semibold mt-1">
                          ₦{Number(cartItem.unitPriceSnapshot).toLocaleString()}{" "}
                          <span className="text-gray-400">each</span>
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          removeItem(cartItem.itemId, {
                            onError: (err) => alert(getErrorMessage(err)),
                          })
                        }
                        disabled={isRemovingThis || actionLoading}
                        className="text-gray-300 hover:text-red-500 disabled:opacity-50 transition-colors shrink-0 hover:bg-red-50 p-2 rounded-lg"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border-2 border-gray-200 rounded-full bg-white">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              cartItem.itemId,
                              cartItem.quantity - 1,
                            )
                          }
                          disabled={isUpdatingThis || actionLoading}
                          className="p-2 disabled:opacity-50 hover:text-brand-600 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-bold text-base min-w-[2.5rem] text-center">
                          {isUpdatingThis ? "…" : cartItem.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              cartItem.itemId,
                              cartItem.quantity + 1,
                            )
                          }
                          disabled={isUpdatingThis || actionLoading}
                          className="p-2 disabled:opacity-50 hover:text-brand-600 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className="font-bold text-lg text-primary">
                        ₦{Number(cartItem.lineTotal).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Summary */}
          <aside className="space-y-5">
            <Card className="h-fit">
              <h2 className="text-lg font-bold text-primary mb-5">
                Order Summary
              </h2>

              <div className="space-y-3.5 text-sm border-b border-gray-200 pb-5">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Items ({cart?.totalItems ?? 0})</span>
                  <span className="font-semibold text-primary">₦{Number(cart?.subtotal ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
              </div>

              <div className="pt-5 flex justify-between font-bold text-lg">
                <span className="text-primary">Total</span>
                <span className="text-brand-600">₦{Number(cart?.subtotal ?? 0).toLocaleString()}</span>
              </div>

              <div className="mt-6">
                <Link to="/checkout">
                  <Button size="lg" fullWidth className="gap-2">
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Trust badges */}
            <div className="bg-brand-50 rounded-2xl border border-brand-200 p-4 text-center">
              <p className="text-xs font-semibold text-brand-700 uppercase tracking-wide">
                🔒 Secure Checkout
              </p>
              <p className="text-xs text-brand-600 mt-1">Powered by Paystack</p>
            </div>

            {/* Continue shopping */}
            <Link to="/shop" className="block">
              <Button variant="secondary" size="lg" fullWidth>
                Continue Shopping
              </Button>
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
};
