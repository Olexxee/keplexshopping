import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminTestimonials,
  getTestimonialStats,
  updateTestimonialStatus,
  deleteTestimonial,
} from "../api/testimonial.api";

export const useAdminTestimonials = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) =>
  useQuery({
    queryKey: ["admin-testimonials", params],
    queryFn: () => getAdminTestimonials(params),
  });

export const useTestimonialStats = () =>
  useQuery({
    queryKey: ["testimonial-stats"],
    queryFn: getTestimonialStats,
  });

export const useUpdateTestimonialStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "APPROVED" | "REJECTED" | "PENDING";
    }) => updateTestimonialStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      qc.invalidateQueries({ queryKey: ["testimonial-stats"] });
    },
  });
};

export const useDeleteTestimonial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTestimonial(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      qc.invalidateQueries({ queryKey: ["testimonial-stats"] });
    },
  });
};
