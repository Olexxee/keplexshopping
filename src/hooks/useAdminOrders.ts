import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllOrders, updateOrderStatus } from "../api/order.api";

const ADMIN_ORDERS_KEY = ["admin", "orders"] as const;

export const useAllOrders = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: [...ADMIN_ORDERS_KEY, params],
    queryFn: () => getAllOrders(params),
  });

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ADMIN_ORDERS_KEY });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
