import { useQuery } from "@tanstack/react-query";
import { getMyOrders, getOrderById } from "../api/order.api";

export const useMyOrders = () =>
  useQuery({
    queryKey: ["orders", "me"],
    queryFn: getMyOrders,
  });

export const useOrderById = (id: string) =>
  useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

