import { api } from "../lib/api";
import type { ApiResponse } from "../types/api.types";
import type { CatalogItem } from "../types/catalog.types";

export interface GetItemsParams {
  status?: string;
  categoryId?: string;
  itemType?: string;
  search?: string;
}

export const getItems = async (
  params?: GetItemsParams,
): Promise<CatalogItem[]> => {
  const response = await api.get<ApiResponse<CatalogItem[]>>("/items", {
    params,
  });
  return response.data.data;
};

export const getItemById = async (id: string): Promise<CatalogItem> => {
  const response = await api.get<ApiResponse<CatalogItem>>(`/items/${id}`);
  return response.data.data;
};
