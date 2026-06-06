import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "../api/dashboard.api";

export const useDashboard = () =>
  useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: getDashboardOverview,
  });
