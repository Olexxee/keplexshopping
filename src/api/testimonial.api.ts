import { api } from "../lib/api";

export const submitTestimonial = async (data: {
  name: string;
  role?: string;
  message: string;
  rating: number;
  imageUrl?: string;
}) => {
  const res = await api.post("/testimonials", data);
  return res.data.data;
};

// ADMIN
export const getAdminTestimonials = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  const res = await api.get("/testimonials/admin", { params });
  return { items: res.data.data, meta: res.data.meta };
};

export const getTestimonialStats = async () => {
  const res = await api.get("/testimonials/admin/stats");
  return res.data.data;
};

export const updateTestimonialStatus = async (id: string, status: "APPROVED" | "REJECTED" | "PENDING") => {
  const res = await api.patch(`/testimonials/admin/${id}/status`, { status });
  return res.data.data;
};

export const deleteTestimonial = async (id: string) => {
  const res = await api.delete(`/testimonials/admin/${id}`);
  return res.data;
};