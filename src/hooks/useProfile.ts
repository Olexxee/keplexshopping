import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/profile.api";
import { AUTH_KEY } from "./useAuth";
import type { User } from "../types/auth.types";

export const useUpdateProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Pick<User, "name" | "email">>) =>
      updateMe(payload),
    onSuccess: (updatedUser) => {
      // Update the auth cache directly so the name in the header updates instantly
      qc.setQueryData(AUTH_KEY, updatedUser);
    },
  });
};
