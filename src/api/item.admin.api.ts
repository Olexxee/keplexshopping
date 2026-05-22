import { api } from "../lib/api";

export const createItem = async (formData: FormData): Promise<void> => {
  await api.post("/items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateItem = async (
  id: string,
  formData: FormData,
): Promise<void> => {
  await api.patch(`/items/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteItem = async (id: string): Promise<void> => {
  await api.delete(`/items/${id}`);
};
