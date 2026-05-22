import { api } from "../lib/api";
import type { Address, AddressPayload } from "../types/address.types";

export const getAddresses = async (): Promise<Address[]> => {
  const res = await api.get("/addresses");
  return res.data.data;
};

export const createAddress = async (
  payload: AddressPayload,
): Promise<Address> => {
  const res = await api.post("/addresses", payload);
  return res.data.data;
};

export const updateAddress = async (
  id: string,
  payload: Partial<AddressPayload>,
): Promise<Address> => {
  const res = await api.patch(`/addresses/${id}`, payload);
  return res.data.data;
};

export const deleteAddress = async (id: string): Promise<void> => {
  await api.delete(`/addresses/${id}`);
};
