import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../api/cart.api";
import type { AddCartItemPayload } from "../api/cart.api";

export const CART_KEY = ["cart"] as const; // exported so useCheckout can import it

export const useCart = () =>
  useQuery({
    queryKey: CART_KEY,
    queryFn: getCart,
  });

const useCartCacheUpdater = () => {
  const qc = useQueryClient();
  return (cart: unknown) => {
    qc.setQueryData(CART_KEY, cart);
  };
};

export const useAddToCart = () => {
  const updateCache = useCartCacheUpdater();
  return useMutation({
    mutationFn: (payload: AddCartItemPayload) => addCartItem(payload),
    onSuccess: updateCache,
  });
};

export const useUpdateCartItem = () => {
  const updateCache = useCartCacheUpdater();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, { quantity }),
    onSuccess: updateCache,
  });
};

export const useRemoveCartItem = () => {
  const updateCache = useCartCacheUpdater();
  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: updateCache,
  });
};

export const useClearCart = () => {
  const updateCache = useCartCacheUpdater();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: updateCache,
  });
};
