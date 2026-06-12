import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as api from "../api/notification.api";

const KEY = ["notification-preferences"];

export const useNotificationPreferences = () =>
  useQuery({
    queryKey: KEY,
    queryFn: api.getPreferences,
  });

export const useUpdateNotificationPreferences = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.updatePreferences,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: KEY,
      });
    },
  });
};
