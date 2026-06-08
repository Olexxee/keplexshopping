import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRegistrations,
  getRegistrationById,
  getRegistrationStats,
  updateRegistrationStatus,
} from "../api/registration.api";
import type { RegistrationStatus } from "../api/registration.api";

const KEYS = {
  all: ["registrations"] as const,
  list: (params?: { status?: string }) =>
    ["registrations", "list", params] as const,
  detail: (id: string) => ["registrations", "detail", id] as const,
  stats: ["registrations", "stats"] as const,
};

export const useRegistrations = (params?: { status?: string }) =>
  useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => getRegistrations(params),
  });

export const useRegistration = (id: string | undefined) =>
  useQuery({
    queryKey: KEYS.detail(id!),
    queryFn: () => getRegistrationById(id!),
    enabled: !!id,
  });

export const useRegistrationStats = () =>
  useQuery({
    queryKey: KEYS.stats,
    queryFn: getRegistrationStats,
  });

export const useUpdateRegistrationStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RegistrationStatus }) =>
      updateRegistrationStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
    },
  });
};
