import { Link } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "../../hooks/useCart";
import { getErrorMessage } from "../../utils/error";

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-400">
            Shopping
          </p>
          <h1 className="text-3xl font-bold mt-1">Your Cart</h1>
        </div>
        {items.length > 0 && (
          <button
            onClick={() =>
              clearCart(undefined, {
                onError: (err) => alert(getErrorMessage(err)),
              })
            }
            disabled={clearPending}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Clear cart
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {getErrorMessage(error)}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading cart...</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Your cart is empty
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Browse the catalog and add something.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-6 bg-black text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-gray-800 transition"
          >
            Go to catalog
          </Link>
        </div>
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
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4"
                >
                  <div className="w-28 h-28 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    {image ? (
                      <img
                        src={image}
                        alt={cartItem.item?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-base">
                          {cartItem.item?.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          ₦{Number(cartItem.unitPriceSnapshot).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          removeItem(cartItem.itemId, {
                            onError: (err) => alert(getErrorMessage(err)),
                          })
                        }
                        disabled={isRemovingThis || actionLoading}
                        className="text-red-400 hover:text-red-600 disabled:opacity-50 transition"
                      >
                        <Trash2 size={18} />
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
                          <Minus size={15} />
                        </button>
                        <span className="px-4 font-medium text-sm">
                          {isUpdatingThis ? "..." : cartItem.quantity}
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
                          <Plus size={15} />
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
          <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Total items</span>
                <span>{cart?.totalItems ?? 0}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₦{Number(cart?.subtotal ?? 0).toLocaleString()}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 mt-5 pt-5 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₦{Number(cart?.subtotal ?? 0).toLocaleString()}</span>
            </div>
            <Link
              to="/checkout"
              className="block text-center mt-5 bg-black text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-gray-800 transition"
            >
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
};
