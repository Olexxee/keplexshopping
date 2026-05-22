import { api } from "../lib/api";

export interface Organisation {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
  [key: string]: unknown;
}

export const getOrganisation = async (): Promise<Organisation> => {
  const response = await api.get("/organisation");
  return response.data.data;
};

export const updateOrganisation = async (
  payload: Partial<Organisation>,
): Promise<Organisation> => {
  const response = await api.put("/organisation", payload);
  return response.data.data;
};
