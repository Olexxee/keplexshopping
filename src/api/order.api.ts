import { api } from "../lib/api";
import type { Order, CheckoutPayload } from "../types/order.types";

export const checkout = async (payload: CheckoutPayload): Promise<Order> => {
  const res = await api.post("/orders/checkout", payload);
  return res.data.data;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const res = await api.get("/orders/me");
  console.log("Fetched my orders:", res.data.data);
  return res.data.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const res = await api.get(`/orders/${id}`);
  return res.data.data;
};

export const getAllOrders = async (
  params?: Record<string, unknown>,
): Promise<Order[]> => {
  const res = await api.get("/orders", { params });
  return res.data.data;
};

export const updateOrderStatus = async (
  id: string,
  status: string,
): Promise<Order> => {
  const res = await api.patch(`/orders/${id}/status`, { status });
  return res.data.data;
};
