import { useQuery } from "@tanstack/react-query";
import { getItems, getItemById } from "../api/item.api";
import type { GetItemsParams } from "../api/item.api";

export const useItems = (params?: GetItemsParams) =>
  useQuery({
    queryKey: ["items", params],
    queryFn: () => getItems(params),
  });

export const useItemById = (id: string) =>
  useQuery({
    queryKey: ["items", id],
    queryFn: () => getItemById(id),
    enabled: !!id,
  });