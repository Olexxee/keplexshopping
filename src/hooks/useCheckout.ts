import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkout } from "../api/checkout.api";
import { initializePayment } from "../api/payment.api";
import type { CheckoutPayload, Order } from "../types/order.types";
import { CART_KEY } from "./useCart";

interface CheckoutResponse {
  order: Order;
  payment: any;
}

export const useCheckout = () => {
  const qc = useQueryClient();

  return useMutation<CheckoutResponse, Error, CheckoutPayload>({
    mutationFn: async (payload: CheckoutPayload) => {
      const { order } = await checkout(payload);
      const payment = await initializePayment(order.id);

      return { order, payment };
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: CART_KEY });
      return data;
    },
  });
};
