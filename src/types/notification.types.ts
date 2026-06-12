export interface Notification {
  id: string;

  title: string;
  message: string;

  type: string;

  isRead: boolean;

  data?: Record<string, unknown>;

  createdAt: string;
}

export interface NotificationPreferences {
  orderEmails: boolean;
  orderStatusEmails: boolean;
  trainingEmails: boolean;
  marketingEmails: boolean;
}