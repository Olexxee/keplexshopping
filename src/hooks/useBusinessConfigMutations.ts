import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { BusinessConfigResponse } from "../types/business-config.types";

export type BusinessConfigKey =
  | "training_programs"
  | "importation_settings"
  | "pricing_rules"
  | "store_settings";

export const updateConfigSection = async (
  key: BusinessConfigKey,
  value: unknown,
): Promise<BusinessConfigResponse> => {
  const { data } = await api.patch(`/business-config/${key}`, { value });
  return data.data;
};

export const useUpdateBusinessConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: BusinessConfigKey; value: unknown }) =>
      updateConfigSection(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-config"] });
    },
  });
};
