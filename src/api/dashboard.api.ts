import { api } from "../lib/api";
import type { DashboardOverview } from "../types/dashboard.types";

export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  const res = await api.get("/dashboard/overview");

  return res.data.data;
};
