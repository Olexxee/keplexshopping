import { api } from "../lib/api";
import type {
  PaymentInitResponse,
  PaymentVerifyResponse,
} from "../types/payment.types";

export const initializePayment = async (
  orderId: string,
): Promise<PaymentInitResponse> => {
  const res = await api.post(`/payments/orders/${orderId}/initialize`);
  return res.data.data;
};

export const verifyPayment = async (
  reference: string,
): Promise<PaymentVerifyResponse> => {
  const res = await api.get(`/payments/verify/${reference}`);
  return res.data.data;
};
