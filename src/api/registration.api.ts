import { api } from "../lib/api";

export type RegistrationStatus = "PENDING" | "PAID" | "CANCELLED";

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: RegistrationStatus;
  paymentRef?: string;
  createdAt: string;
  trainingProgram?: {
    id: string;
    title: string;
  };
}

export interface RegistrationStats {
  total: number;
  pending: number;
  paid: number;
  cancelled: number;
}

// ── match this to whatever path registrationRouter is mounted on ──
// e.g. if app.use("/api/registrations", registrationRouter) → BASE = "/registrations"
// e.g. if app.use("/api/training-registrations", ...) → BASE = "/training-registrations"
const BASE = "/registrations"; // ← update this to match your server mount path

export const getRegistrations = async (params?: {
  status?: string;
}): Promise<Registration[]> => {
  const res = await api.get(BASE, { params });
  return res.data.data;
};

export const getRegistrationById = async (
  id: string,
): Promise<Registration> => {
  const res = await api.get(`${BASE}/${id}`);
  return res.data.data;
};

export const getRegistrationStats = async (): Promise<RegistrationStats> => {
  const res = await api.get(`${BASE}/stats`);
  return res.data.data;
};

export const updateRegistrationStatus = async (
  id: string,
  status: RegistrationStatus,
): Promise<Registration> => {
  const res = await api.patch(`${BASE}/${id}/status`, { status });
  return res.data.data;
};