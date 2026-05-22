import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItem, updateItem, deleteItem } from "../api/item.admin.api";

const ITEMS_KEY = ["items"] as const;

export const useCreateItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createItem(formData),
    onSuccess: () => qc.invalidateQueries({ queryKey: ITEMS_KEY }),
  });
};

export const useUpdateItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateItem(id, formData),
    onSuccess: () => qc.invalidateQueries({ queryKey: ITEMS_KEY }),
  });
};

export const useDeleteItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ITEMS_KEY }),
  });
};
