import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../api/address.api";
import type { AddressPayload } from "../types/address.types";

const ADDRESSES_KEY = ["addresses"] as const;

export const useAddresses = () =>
  useQuery({
    queryKey: ADDRESSES_KEY,
    queryFn: getAddresses,
  });

export const useCreateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressPayload) => createAddress(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
};

export const useUpdateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<AddressPayload>;
    }) => updateAddress(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
};

export const useDeleteAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
};
