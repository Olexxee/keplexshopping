import type { AxiosError } from "axios";
import type { ApiError } from "../types/auth.types";

export const getErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<ApiError>;
  return (
    axiosError.response?.data?.message ??
    "Something went wrong. Please try again."
  );
};
