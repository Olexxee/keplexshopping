import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  getUserById,
  createStaff,
  updateUserRole,
  updateUserStatus,
} from "../api/admin.api";
import type { GetUsersParams, CreateStaffPayload } from "../api/admin.api";

const USERS_KEY = ["admin", "users"] as const;

export const useUsers = (params?: GetUsersParams) =>
  useQuery({
    queryKey: [...USERS_KEY, params],
    queryFn: () => getUsers(params),
  });

export const useUserById = (id: string) =>
  useQuery({
    queryKey: [...USERS_KEY, id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });

export const useCreateStaff = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStaffPayload) => createStaff(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
};

export const useUpdateUserRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      updateUserRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
};

export const useUpdateUserStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateUserStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
};
