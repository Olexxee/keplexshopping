import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMe, login, logout, register } from "../api/auth.api";
import type { LoginPayload, RegisterPayload } from "../types/auth.types";

export const AUTH_KEY = ["auth", "me"] as const;

export const useMe = () =>
  useQuery({
    queryKey: AUTH_KEY,
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
  });

export const useLogin = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (user) => {
      qc.setQueryData(AUTH_KEY, user); // user is now the flat user object
      navigate("/dashboard");
    },
  });
};

export const useRegister = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (user) => {
      qc.setQueryData(AUTH_KEY, user);
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
      qc.setQueryData(AUTH_KEY, null);
      qc.clear();
      navigate("/auth");
    },
  });
};
