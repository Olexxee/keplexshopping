import { useQuery } from "@tanstack/react-query";
import { getTrainingById } from "../api/training.api";

export const useTraining = (id: string) => {
  return useQuery({
    queryKey: ["training", id],
    queryFn: async () => {
      const res = await getTrainingById(id);
      return res.data;
    },
    enabled: !!id,
  });
};
