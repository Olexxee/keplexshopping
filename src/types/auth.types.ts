export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "staff" | "admin";
}

export interface AuthResponse {
  user: User;
  // no token field — server sets httpOnly cookie directly
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}