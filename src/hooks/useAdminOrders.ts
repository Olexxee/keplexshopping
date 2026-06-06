import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "../api/order.api";

const ADMIN_ORDERS_KEY = ["admin", "orders"];

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderStatus(id, status),

    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ADMIN_ORDERS_KEY });

      const previous = qc.getQueriesData({ queryKey: ADMIN_ORDERS_KEY });

      qc.setQueriesData({ queryKey: ADMIN_ORDERS_KEY }, (old: any) => {
        if (!old) return old;

        return old.map((order: any) =>
          order.id === id ? { ...order, status } : order,
        );
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        context.previous.forEach(([key, data]) => {
          qc.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ADMIN_ORDERS_KEY });
    },
  });
};
