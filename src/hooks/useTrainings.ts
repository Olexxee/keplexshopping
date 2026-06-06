import { useQuery } from "@tanstack/react-query";
import { getTrainings } from "../api/training.api";

export const useTrainings = () => {
  return useQuery({
    queryKey: ["trainings"],
    queryFn: async () => {
      const res = await getTrainings();
      return res.data;
    },
  });
};
