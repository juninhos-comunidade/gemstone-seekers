import axios, { type AxiosRequestConfig, isAxiosError } from "axios";
import { ApiError, type ApiErrorResponse } from "./errors";
import { getAuthToken, removeAuthToken } from "./auth";
import { translateErrorMessage, translateSuccessMessage } from "./translations";

const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return "/api";
  }

  if (process.env.API_INTERNAL_URL) {
    return process.env.API_INTERNAL_URL;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/api`;
  }

  return "http://localhost:3000/api";
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
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
  (response) => {
    if (
      response?.data &&
      typeof response.data === "object" &&
      "message" in response.data &&
      typeof response.data.message === "string"
    ) {
      response.data.message = translateSuccessMessage(response.data.message);
    }
    return response;
  },
  (error) => {
    if (isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data as ApiErrorResponse;

        if (status === 401 && typeof window !== "undefined") {
          removeAuthToken();
          if (!window.location.pathname.startsWith("/login")) {
            window.location.href = "/login";
          }
        }

        const rawMessage =
          data?.error?.message ||
          data?.message ||
          error.response.statusText ||
          "An error occurred during the request.";
        const errorCode = data?.error?.code;
        const message = translateErrorMessage(rawMessage, errorCode);

        return Promise.reject(new ApiError(status, message, data));
      }

      if (error.code === "ECONNABORTED" || /timeout/i.test(error.message)) {
        const rawMessage = error.message || "timeout of 10000ms exceeded";
        const message = translateErrorMessage(rawMessage, "ECONNABORTED");
        const data: ApiErrorResponse = {
          message,
          error: {
            code: "ECONNABORTED",
            message,
          },
        };
        return Promise.reject(new ApiError(408, message, data));
      }
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
