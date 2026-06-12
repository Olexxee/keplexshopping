import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as notificationApi from "../api/notification.api";

const KEY = ["notifications"];

export const useNotifications = () =>
  useQuery({
    queryKey: KEY,
    queryFn: notificationApi.getNotifications,
  });

export const useUnreadNotifications = () =>
  useQuery({
    queryKey: [...KEY, "count"],
    queryFn: notificationApi.getUnreadCount,
  });

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markNotificationRead,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAllNotificationsRead,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
};

export const useDeleteNotification = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.deleteNotification,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
};
