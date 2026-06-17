import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await api.get("/wishlist");
      return res.data.data;
    },
  });
};