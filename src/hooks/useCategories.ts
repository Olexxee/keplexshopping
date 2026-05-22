import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/category.api";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10, // categories rarely change — cache 10 min
  });
