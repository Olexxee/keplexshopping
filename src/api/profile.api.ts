import { api } from "../lib/api";
import type { User } from "../types/auth.types";

export const getMe = async (): Promise<User> => {
  const res = await api.get("/auth/me");
  return res.data.data;
};

export const updateMe = async (
  payload: Partial<Record<"name" | "email", string>>,
): Promise<User> => {
  const res = await api.patch("/auth/me", payload);
  return res.data.data;
};
