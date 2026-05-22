import { api } from "../lib/api";

export interface DashboardOverview {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number | string;
  totalItems: number;
  pendingOrders?: number;
  [key: string]: unknown; // backend may add more fields
}

export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  const response = await api.get("/dashboard/overview");
  return response.data.data;
};