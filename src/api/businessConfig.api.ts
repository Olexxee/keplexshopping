import { api } from "../lib/api";

export const getBusinessConfig = async () => {
  const res = await api.get("/business-config");
  return res.data.data;
};

export const updateConfigSection = async (key: string, value: unknown) => {
  const res = await api.patch(`/business-config/${key}`, { value });
  return res.data.data;
};
