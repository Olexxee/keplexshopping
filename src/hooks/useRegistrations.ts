import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useRegistrations = (params?: { status?: string }) => {
  return useQuery({
    queryKey: ["registrations", params],
    queryFn: async () => {
      const res = await api.get("/training-enrollments", { params });
      return res.data.data;
    },
  });
};
