import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkout } from "../api/order.api";
import { initializePayment } from "../api/payment.api";
import type { CheckoutPayload } from "../types/order.types";
import { CART_KEY } from "./useCart";

export const useCheckout = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      const order = await checkout(payload);
      const payment = await initializePayment(order.id);
      return { order, payment };
    },
    onSuccess: ({ payment }) => {
      qc.invalidateQueries({ queryKey: CART_KEY });
      window.location.href = payment.authorizationUrl;
    },
  });
};
