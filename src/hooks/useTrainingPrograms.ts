import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getTrainings,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
  toggleFeaturedTraining,
  toggleTrainingStatus,
  uploadTrainingMedia,
} from "../api/training.api";

const TRAININGS_KEY = ["training-programs"] as const;

export const useTrainingPrograms = () =>
  useQuery({
    queryKey: TRAININGS_KEY,
    queryFn: async () => {
      const res = await getTrainings();
      return res.data.data;
    },
  });

export const useTrainingProgram = (id: string) =>
  useQuery({
    queryKey: [...TRAININGS_KEY, id],
    queryFn: async () => {
      const res = await getTrainingById(id);
      return res.data.data;
    },
    enabled: !!id,
  });

export const useCreateTraining = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createTraining,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: TRAININGS_KEY,
      });
    },
  });
};

export const useUpdateTraining = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateTraining(id, data),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: TRAININGS_KEY,
      });
    },
  });
};

export const useToggleTrainingStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleTrainingStatus(id, active),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["training-programs"] });
    },
  });
};

export const useDeleteTraining = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteTraining,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: TRAININGS_KEY,
      });
    },
  });
};

export const useToggleFeaturedTraining = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      toggleFeaturedTraining(id, featured),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["training-programs"] });
    },
  });
};

export const useUploadTrainingMedia = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      uploadTrainingMedia(id, data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["training-programs"] });
    },
  });
};