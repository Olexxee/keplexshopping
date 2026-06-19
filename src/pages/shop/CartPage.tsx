import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, ArrowRight } from "lucide-react";

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
          className="bg-card rounded-xl border border-border shadow-md p-5 flex gap-5 animate-pulse"
        >
          <div className="w-32 h-32 rounded-lg bg-muted/50 shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 w-40 bg-muted/50 rounded-lg" />
            <div className="h-3 w-24 bg-muted/50 rounded-lg" />
            <div className="h-8 w-32 bg-muted/50 rounded-full mt-4" />
          </div>
        </div>
      ))}
    </div>
    <div className="bg-card rounded-xl border border-border shadow-md p-6 h-fit animate-pulse space-y-4">
      <div className="h-5 w-32 bg-muted/50 rounded-lg" />
      <div className="h-4 w-full bg-muted/50 rounded-lg" />
      <div className="h-4 w-full bg-muted/50 rounded-lg" />
      <div className="h-10 w-full bg-muted/50 rounded-lg mt-6" />
    </div>
  </div>
);

// Helper to safely get price values
const getSafePrice = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export const CartPage = () => {
  const { data: cart, isLoading, error, refetch } = useCart();
  const {
    mutate: updateItem,
    isPending: updatePending,
    variables: updateVars,
  } = useUpdateCartItem();
  const {
    isPending: removePending,
  } = useRemoveCartItem();
  const { mutate: clearCart, isPending: clearPending } = useClearCart();

  const items = cart?.items ?? [];

  console.log(items)

  const actionLoading = updatePending || removePending || clearPending;
  const hasCheckoutIssues = items.some((item) => !item.inStock || item.unavailable);

  const handleQuantityChange = (itemId: string, next: number) => {
    console.log("HANDLE", itemId, next);

    if (next < 1) return;

    updateItem(
      { itemId, quantity: next },
      {
        onError: (err) => alert(getErrorMessage(err)),
      },
    );
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId, {
      onSuccess: () => {
        // Refetch cart after removal
        refetch();
      },
      onError: (err) => alert(getErrorMessage(err)),
    });
  };

  const handleClearCart = () => {
    clearCart(undefined, {
      onSuccess: () => {
        // Refetch cart after clearing
        refetch();
      },
      onError: (err) => alert(getErrorMessage(err)),
    });
  };

  // Calculate totals safely
  const subtotal = items.reduce((sum, item) => {
    const price = getSafePrice(item.unitPriceSnapshot);
    const quantity = getSafePrice(item.quantity);
    return sum + (price * quantity);
  }, 0);

  const totalItems = items.reduce((sum, item) => sum + getSafePrice(item.quantity), 0);

  if (isLoading) {
    return (
      <div className="space-y-8 py-8">
        <PageHeader label="Shopping Bag" title="Your Cart" />
        <CartSkeleton />
      </div>
    );
  }

  {hasCheckoutIssues ? (
  <Button size="lg" fullWidth disabled>
    Resolve cart issues first
  </Button>
) : (
  <Link to="/checkout">
    <Button size="lg" fullWidth className="gap-2">
      Proceed to Checkout
      <ArrowRight size={18} />
    </Button>
  </Link>
)}

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
              onClick={handleClearCart}
              disabled={clearPending}
            >
              {clearPending ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Clearing...
                </>
              ) : (
                "Clear cart"
              )}
            </Button>
          ) : undefined
        }
      />

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-6 py-4 font-medium">
          {getErrorMessage(error)}
        </div>
      )}

      {items.length === 0 ? (
        <Card className="py-16 text-center">
          <div className="mx-auto max-w-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber/10">
              <ShoppingCart className="h-10 w-10 text-amber" />
            </div>
            <h2 className="font-display text-display-sm text-foreground">
              Your cart is empty
            </h2>
            <p className="mt-3 text-muted-foreground">
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

              return (
                <Card key={cartItem.id} hoverable className="p-5 flex gap-5">
                  <div className="w-32 h-32 rounded-lg bg-muted/30 overflow-hidden shrink-0 ring-1 ring-border">
                    {image ? (
                      <img
                        src={image}
                        alt={cartItem.item?.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-muted-foreground bg-muted/20">
                        No image
                      </div>
                    )}
                  </div>
                  {!cartItem.inStock && (
                    <p className="mt-2 text-sm text-destructive font-medium">
                      Only {cartItem.availableStock} left in stock.
                    </p>
                  )}

                  {cartItem.unavailable && (
                    <p className="mt-2 text-sm text-destructive font-medium">
                      This item is no longer available.
                    </p>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between gap-4">
                      <div className="min-w-0">
                        <Link to={`/shop/${cartItem.itemId}`}>
                          <h2 className="font-display font-semibold text-foreground hover:text-amber transition-colors truncate">
                            {cartItem.item?.name || "Product"}
                          </h2>
                        </Link>
                        <p className="text-sm text-amber font-semibold mt-1">
                          ₦{cartItem.unitPrice.toLocaleString()}{" "}
                          <span className="text-muted-foreground font-normal">
                            each
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          handleQuantityChange(
                            cartItem.itemId,
                            cartItem.quantity + 1,
                          )
                        }
                        disabled={
                          isUpdatingThis ||
                          actionLoading ||
                          cartItem.quantity >= cartItem.availableStock
                        }
                        className="p-2 disabled:opacity-50 hover:text-amber transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-full bg-background">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              cartItem.itemId,
                              quantity - 1,
                            )
                          }
                          disabled={isUpdatingThis || actionLoading}
                          className="p-2 disabled:opacity-50 hover:text-amber transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-semibold text-foreground min-w-[2.5rem] text-center">
                          {isUpdatingThis ? "…" : quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              cartItem.itemId,
                              quantity + 1,
                            )
                          }
                          disabled={isUpdatingThis || actionLoading}
                          className="p-2 disabled:opacity-50 hover:text-amber transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className="font-display font-semibold text-xl text-foreground">
                        ₦{cartItem.lineTotal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {hasCheckoutIssues && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
              <p className="text-sm font-medium text-destructive">
                Some items in your cart are unavailable or exceed current stock
                levels. Please update your cart before checkout.
              </p>
            </div>
          )}

          {/* Summary */}
          <aside className="space-y-5">
            <Card className="h-fit">
              <h2 className="font-display text-display-sm text-foreground mb-5">
                Order Summary
              </h2>

              <div className="space-y-3.5 text-sm border-b border-border pb-5">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">
                    Items ({cart?.totalItems ?? 0})
                  </span>
                  <span className="font-semibold text-foreground">
                    ₦{Number(cart?.subtotal ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">
                    Shipping
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    FREE
                  </span>
                </div>
              </div>

              <span className="text-amber">
                ₦{(cart?.subtotal ?? 0).toLocaleString()}
              </span>

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
            <div className="bg-amber/5 rounded-xl border border-amber/20 p-4 text-center">
              <p className="text-xs font-semibold text-amber uppercase tracking-wide">
                🔒 Secure Checkout
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Powered by Paystack
              </p>
            </div>

            {/* Continue shopping */}
            <Link to="/shop" className="block">
              <Button variant="outline" size="lg" fullWidth>
                Continue Shopping
              </Button>
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
};