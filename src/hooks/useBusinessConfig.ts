import { useQuery } from "@tanstack/react-query";

import { getBusinessConfig } from "../api/businessConfig.api";

export const useBusinessConfig = () => {
  return useQuery({
    queryKey: ["business-config"],
    queryFn: getBusinessConfig,
  });
};
