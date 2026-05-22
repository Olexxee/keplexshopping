import { api } from "../lib/api";

export interface AuditLog {
  id: string;
  action: string;
  userId?: string;
  resource?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  const response = await api.get("/audit-logs");
  return response.data.data;
};
