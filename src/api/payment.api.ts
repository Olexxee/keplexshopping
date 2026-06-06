import { api } from "../lib/api";
import type {
  PaymentInitResponse,
  PaymentVerifyResponse,
} from "../types/payment.types";

// POST /payments/order/:orderId/init
export const initializePayment = async (
  orderId: string,
): Promise<PaymentInitResponse> => {
  const res = await api.post(`/payments/order/${orderId}/init`);
  return res.data.data;
};

// GET /payments/verify/:reference
export const verifyPayment = async (
  reference: string,
): Promise<PaymentVerifyResponse> => {
  const res = await api.get(`/payments/verify/${reference}`);
  return res.data.data;
};
