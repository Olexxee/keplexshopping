import { api } from "../lib/api";

import type {
  Notification,
  NotificationPreferences,
} from "../types/notification.types";

export const getNotifications = async (): Promise<Notification[]> => {
  const res = await api.get("/notifications");
  return res.data.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const res = await api.get("/notifications/unread-count");
  return res.data.data.count;
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await api.patch("/notifications/read-all");
};

export const deleteNotification = async (id: string): Promise<void> => {
  await api.delete(`/notifications/${id}`);
};

export const getPreferences = async (): Promise<NotificationPreferences> => {
  const res = await api.get("/notifications/preferences");

  return res.data.data;
};

export const updatePreferences = async (
  payload: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> => {
  const res = await api.patch("/notifications/preferences", payload);

  return res.data.data;
};
