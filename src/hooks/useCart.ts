import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../api/cart.api";
import type { AddCartItemPayload } from "../api/cart.api";

type UpdateCartItemPayload = {
  itemId: string;
  quantity: number;
};

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
    mutationFn: (payload: UpdateCartItemPayload) => {
      console.log("MUTATION PAYLOAD", payload);

      return updateCartItem(payload.itemId, {
        quantity: payload.quantity,
      });
    },
    onSuccess: updateCache,
  });
};

export const useRemoveCartItem = () => {
  const updateCache = useCartCacheUpdater();
  return useMutation({
    mutationFn: (cartItemId: string) => removeCartItem(cartItemId),
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
