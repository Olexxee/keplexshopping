import { api } from "../lib/api";
import type { LoginPayload, RegisterPayload, User } from "../types/auth.types";
import type { UpdateProfilePayload, ChangePasswordPayload } from "../types/profile.types";

export const login = async (payload: LoginPayload): Promise<User> => {
  const res = await api.post("/auth/login", payload);
  return res.data.data.user;
};

export const register = async (payload: RegisterPayload): Promise<User> => {
  const res = await api.post("/auth/register", payload);
  return res.data.data.user;
};

export const refreshSession = async (): Promise<void> => {
  await api.post("/auth/refresh");
};

export const updateMe = async (
  payload: UpdateProfilePayload,
): Promise<unknown> => {
  const res = await api.patch(
    "/auth/me",
    payload,
  );

  return res.data.data;
};

export const changePassword = async (
  payload: ChangePasswordPayload
) => {
  const res = await api.patch(
    "/auth/change-password",
    payload,
  );

  return res.data.data;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get("/auth/me");
  if (!res.data.data) throw new Error("Not authenticated");
  return res.data.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};