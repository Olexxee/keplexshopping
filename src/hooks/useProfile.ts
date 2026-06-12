import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/profile.api";
import { AUTH_KEY } from "./useAuth";
import type { User } from "../types/auth.types";
import type { UpdateProfilePayload } from "../types/profile.types";

export const useUpdateProfile = () => {
  const qc = useQueryClient();

  return useMutation<User, unknown, UpdateProfilePayload>({
    mutationFn: (payload) => updateMe(payload),

    onSuccess: (updatedUser) => {
      qc.setQueryData(AUTH_KEY, updatedUser);
    },
  });
};
