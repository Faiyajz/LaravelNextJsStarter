import axios, { type AxiosRequestConfig } from "axios";
import { notify } from "./toast";
import { authEvents } from "./auth-events";
import { authStorage } from "./auth-storage";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const withSkipErrorToast = (
  config: AxiosRequestConfig = {},
): AxiosRequestConfig => ({
  ...config,
  headers: {
    ...(config.headers ?? {}),
    "X-Skip-Error-Toast": "1",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// global error handling
api.interceptors.response.use(
  (r) => r,
  (e) => {
    const requestId = e.response?.headers?.["x-request-id"];
    console.error("API Error:", e.response || e, requestId ? { requestId } : "");
    const skipToast =
      e.config?.headers?.["X-Skip-Error-Toast"] === "1" ||
      e.config?.headers?.["x-skip-error-toast"] === "1";
    if (!skipToast) {
      let message = e.response?.data?.message ?? "Something went wrong";
      if (e.response?.status === 422 && e.response?.data?.errors) {
        const firstError = Object.values(e.response.data.errors)
          .flat()
          .find(Boolean);
        if (typeof firstError === "string" && firstError.trim()) {
          message = firstError;
        }
      }
      notify.error(message);
    }
    if (e.response?.status === 401) {
      authEvents.emitUnauthorized();
    }
    return Promise.reject(e);
  },
);
