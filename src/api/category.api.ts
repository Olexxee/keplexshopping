import { api } from "../lib/api";
import type { ApiResponse } from "../types/api.types";
import type { Category, CategoryType } from "../types/catalog.types";

export interface CategoryPayload {
  name: string;
  slug: string;
  description?: string;
  type: CategoryType;
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<ApiResponse<Category[]>>("/category");
  return response.data.data;
};

export const createCategory = async (
  payload: CategoryPayload,
): Promise<Category> => {
  const response = await api.post<ApiResponse<Category>>("/category", payload);
  return response.data.data;
};

export const updateCategory = async (
  id: string,
  payload: Partial<CategoryPayload>,
): Promise<Category> => {
  const response = await api.patch<ApiResponse<Category>>(
    `/category/${id}`,
    payload,
  );
  return response.data.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/category/${id}`);
};
