import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../api/order.api";

export const useOrder = (id?: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  });
};
