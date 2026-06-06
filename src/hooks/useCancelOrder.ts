import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "../api/order.api";

export const useCancelOrder = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelOrder(id),

    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order", id] });
    },
  });
};
