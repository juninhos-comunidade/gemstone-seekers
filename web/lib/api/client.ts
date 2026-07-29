import axios, { type AxiosRequestConfig, isAxiosError } from "axios";
import { ApiError, type ApiErrorResponse } from "./errors";
import { getAuthToken, removeAuthToken } from "./auth";

const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "http://localhost:3000/api";
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  adapter: "fetch",
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response) {
      const status = error.response.status;
      const data = error.response.data as ApiErrorResponse;

      if (status === 401 && typeof window !== "undefined") {
        removeAuthToken();
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }

      const message =
        data?.message ||
        error.response.statusText ||
        "Ocorreu um erro na requisição.";
      return Promise.reject(new ApiError(status, message, data));
    }
    return Promise.reject(error);
  },
);

export const httpClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<T>(url, config);
    return response.data;
  },
  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },
  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },
  patch: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await api.patch<T>(url, data, config);
    return response.data;
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete<T>(url, config);
    return response.data;
  },
};
