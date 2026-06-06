import { useQuery } from "@tanstack/react-query";
import { getPublicOffers } from "../api/offers.api";

export const useOffers = () => {
  return useQuery({
    queryKey: ["public-offers"],
    queryFn: async () => {
      const res = await getPublicOffers();
      return res.data.data;
    },
  });
};
