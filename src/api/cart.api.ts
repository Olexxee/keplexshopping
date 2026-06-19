import { api } from "../lib/api";
import type { Cart } from "../types/cart.types";

export interface AddCartItemPayload {
  itemId: string;
  quantity: number;
}

export const getCart = async (): Promise<Cart> => {
  const res = await api.get("/cart");
  return res.data.data;
};

export const addCartItem = async (
  payload: AddCartItemPayload,
): Promise<Cart> => {
  const res = await api.post("/cart/items", payload);
  return res.data.data;
};

// export const updateCartItem = async (
//   itemId: string,
//   payload: { quantity: number },
// ): Promise<Cart> => {
//   const res = await api.patch(`/cart/items/${itemId}`, payload);
//   return res.data.data;
// };

export const updateCartItem = async (
  itemId: string,
  payload: { quantity: number },
): Promise<Cart> => {
  console.log("API CALL", itemId, payload);

  const res = await api.patch(`/cart/items/${itemId}`, payload);

  return res.data.data;
};

export const removeCartItem = async (itemId: string): Promise<Cart> => {
  const res = await api.delete(`/cart/items/${itemId}`);
  return res.data.data;
};

export const clearCart = async (): Promise<Cart> => {
  const res = await api.delete("/cart/clear");
  return res.data.data;
};
