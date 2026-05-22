import { api } from "../lib/api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "../types/auth.types";

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
};

export const register = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data;
};

export const refreshSession = async (): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/refresh");
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/auth/me");
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout"); // server clears the cookie
};
