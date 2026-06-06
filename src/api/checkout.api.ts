import { api } from "../lib/api";
import type { CheckoutPayload, Order } from "../types/order.types";

export const checkout = async (
  payload: CheckoutPayload,
): Promise<{
  id(id: any): unknown; order: Order 
}> => {
  const res = await api.post("/checkout", payload);

  return res.data.data;
};
