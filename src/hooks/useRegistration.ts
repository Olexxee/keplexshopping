import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateRegistrationStatus = (_id: string, _data: { status: string }) => {
  // API call implementation
  return Promise.resolve();
};

export const useUpdateRegistrationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateRegistrationStatus(id, {
        status,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["registrations"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-overview"],
      });

      queryClient.invalidateQueries({
        queryKey: ["registration-stats"],
      });
    },
  });
};
