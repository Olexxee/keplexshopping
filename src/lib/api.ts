import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Not a 401, or already a retry — bail out
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Queue subsequent 401s while refresh is in flight
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(original));
    }

    original._retry = true;
    isRefreshing = true;

    try {
      await api.post("/auth/refresh"); // server rotates the httpOnly cookie
      processQueue(null);
      return api(original); // retry the original request
    } catch (refreshError) {
      processQueue(refreshError);
      window.location.href = "/auth"; // session dead — send to login
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
