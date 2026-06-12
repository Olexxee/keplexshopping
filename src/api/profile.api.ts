import { api } from "../lib/api";
import type { User } from "../types/auth.types";
import type { UpdateProfilePayload } from "../types/profile.types";

export const getMe = async (): Promise<User> => {
  const res = await api.get("/auth/me");
  return res.data.data;
};

export const updateMe = async (
  payload: UpdateProfilePayload,
): Promise<User> => {
  const res = await api.patch("/auth/me", payload);
  return res.data.data;
};
