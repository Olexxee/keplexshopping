import { api } from "../lib/api";
import type { LoginPayload, RegisterPayload, User } from "../types/auth.types";

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

export const getMe = async (): Promise<User> => {
  const res = await api.get("/auth/me");
  console.log("getMe raw response:", res.data);
  return res.data.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};