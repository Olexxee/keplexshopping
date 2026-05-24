export interface AuthResponse {
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "SUPER_ADMIN" | "ADMIN" | "STAFF" | "USER";
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}