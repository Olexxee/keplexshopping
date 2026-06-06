import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react";

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
  <div className="grid lg:grid-cols-[1fr_360px] gap-6">
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 animate-pulse"
        >
          <div className="w-28 h-28 rounded-xl bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 w-40 bg-gray-100 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
            <div className="h-8 w-32 bg-gray-100 rounded-full mt-4" />
          </div>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit animate-pulse space-y-4">
      <div className="h-5 w-32 bg-gray-100 rounded" />
      <div className="h-4 w-full bg-gray-100 rounded" />
      <div className="h-4 w-full bg-gray-100 rounded" />
      <div className="h-10 w-full bg-gray-100 rounded-xl mt-4" />
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
      <div className="space-y-6">
        <PageHeader label="Shopping" title="Your Cart" />
        <CartSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        label="Shopping"
        title="Your Cart"
        action={
          items.length > 0 ? (
            <Button
              variant="secondary"
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
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {getErrorMessage(error)}
        </div>
      )}

      {items.length === 0 ? (
        <Card className="py-14 text-center">
          <div className="mx-auto max-w-xs">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
              <ShoppingCart className="h-6 w-6 text-gray-300" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Browse the catalog and add something.
            </p>
            <div className="mt-6">
              <Link to="/shop">
                <Button size="sm">Go to catalog</Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
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
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex gap-4"
                >
                  <div className="w-28 h-28 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    {image ? (
                      <img
                        src={image}
                        alt={cartItem.item?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-gray-300">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="font-semibold text-base text-gray-900 truncate">
                          {cartItem.item?.name}
                        </h2>
                        <p className="text-sm text-gray-400 mt-0.5">
                          ₦{Number(cartItem.unitPriceSnapshot).toLocaleString()}{" "}
                          each
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          removeItem(cartItem.itemId, {
                            onError: (err) => alert(getErrorMessage(err)),
                          })
                        }
                        disabled={isRemovingThis || actionLoading}
                        className="text-gray-300 hover:text-red-400 disabled:opacity-50 transition shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-full">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              cartItem.itemId,
                              cartItem.quantity - 1,
                            )
                          }
                          disabled={isUpdatingThis || actionLoading}
                          className="p-2 disabled:opacity-50 hover:bg-gray-50 rounded-full transition"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 font-medium text-sm min-w-[2rem] text-center">
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
                          className="p-2 disabled:opacity-50 hover:bg-gray-50 rounded-full transition"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <p className="font-bold text-gray-900">
                        ₦{Number(cartItem.lineTotal).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Summary */}
          <aside className="space-y-4">
            <Card className="h-fit">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Items</span>
                  <span>{cart?.totalItems ?? 0}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₦{Number(cart?.subtotal ?? 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-base text-gray-900">
                <span>Total</span>
                <span>₦{Number(cart?.subtotal ?? 0).toLocaleString()}</span>
              </div>

              <div className="mt-5">
                <Link to="/checkout">
                  <Button size="lg" fullWidth>
                    Proceed to checkout
                  </Button>
                </Link>
              </div>
            </Card>

            <p className="text-center text-xs text-gray-400">
              🔒 Secure checkout powered by Paystack
            </p>
          </aside>
        </div>
      )}
    </div>
  );
};
