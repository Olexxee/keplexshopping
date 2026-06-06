import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../api/order.api";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getMyOrders,
  });
};
