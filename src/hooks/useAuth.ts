import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMe, login, logout, register } from "../api/auth.api";
import type { LoginPayload, RegisterPayload } from "../types/auth.types";

export const AUTH_KEY = ["auth", "me"] as const;

export const useMe = () =>
  useQuery({
    queryKey: AUTH_KEY,
    queryFn: getMe,
    retry: false, // don't retry on 401 — user is just logged out
    staleTime: Infinity, // user object doesn't change mid-session
  });

export const useLogin = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      qc.setQueryData(AUTH_KEY, data.user); // seed the cache immediately
      navigate("/dashboard");
    },
  });
};

export const useRegister = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (data) => {
      qc.setQueryData(AUTH_KEY, data.user);
      navigate("/dashboard");
    },
  });
};

export const useLogout = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      qc.clear(); // wipe all cached data
      navigate("/auth");
    },
  });
};
