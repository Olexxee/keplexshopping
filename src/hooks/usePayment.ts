import { useMutation } from "@tanstack/react-query";
import { initializePayment, verifyPayment } from "../api/payment.api";

export const useInitializePayment = () =>
  useMutation({
    mutationFn: (orderId: string) => initializePayment(orderId),
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl;
    },
  });

export const useVerifyPayment = () =>
  useMutation({
    mutationFn: (reference: string) => verifyPayment(reference),
  });
