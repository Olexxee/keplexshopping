import { api } from "../lib/api";
import type { Order } from "../types/order.types";

export interface PaginatedOrdersResponse {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getMyOrders = async (): Promise<PaginatedOrdersResponse> => {
  const res = await api.get("/orders/me");
  return res.data.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const res = await api.get(`/orders/${id}`);
  return res.data.data;
};

export const getAllOrders = async (
  params?: Record<string, unknown>,
): Promise<PaginatedOrdersResponse> => {
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

export const cancelOrder = async (id: string): Promise<void> => {
  await api.delete(`/orders/${id}`);
};
