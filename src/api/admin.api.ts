import { api } from "../lib/api";
import type { User } from "../types/auth.types";

export interface GetUsersParams {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  password: string;
  role: "staff" | "admin";
}

export const getUsers = async (params?: GetUsersParams): Promise<User[]> => {
  const response = await api.get("/admin/users", { params });
  return response.data.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data.data;
};

export const createStaff = async (
  payload: CreateStaffPayload,
): Promise<User> => {
  const response = await api.post("/admin/staff", payload);
  return response.data.data;
};

export const updateUserRole = async (
  id: string,
  role: string,
): Promise<User> => {
  const response = await api.patch(`/admin/users/${id}/role`, { role });
  return response.data.data;
};

export const updateUserStatus = async (
  id: string,
  status: string,
): Promise<User> => {
  const response = await api.patch(`/admin/users/${id}/status`, { status });
  return response.data.data;
};
