import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { api, httpClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { setAuthToken, getAuthToken, removeAuthToken } from "@/lib/api/auth";

type InterceptorHandler<T> = {
  fulfilled: (_value: T) => T | Promise<T>;
  rejected: (_error: unknown) => Promise<never>;
};

type InterceptorManagerShim<T> = {
  handlers: InterceptorHandler<T>[];
};

describe("ApiError", () => {
  it("should create a correct instance of ApiError", () => {
    const error = new ApiError(404, "Resource not found", {
      message: "Resource not found",
    });
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.name).toBe("ApiError");
    expect(error.status).toBe(404);
    expect(error.message).toBe("Resource not found");
    expect(error.data).toEqual({ message: "Resource not found" });
  });
});

describe("httpClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("should execute GET request and return data", async () => {
    const mockData = { id: 1, name: "Gemstone" };
    vi.spyOn(api, "get").mockResolvedValue({ data: mockData } as AxiosResponse);

    const data = await httpClient.get<{ id: number; name: string }>("gems/1");
    expect(api.get).toHaveBeenCalledWith("gems/1", undefined);
    expect(data).toEqual(mockData);
  });

  it("should execute POST request and return data", async () => {
    const mockPayload = { name: "Ruby" };
    const mockResponse = { id: 2, name: "Ruby" };
    vi.spyOn(api, "post").mockResolvedValue({
      data: mockResponse,
    } as AxiosResponse);

    const data = await httpClient.post<{ id: number; name: string }>(
      "gems",
      mockPayload,
    );
    expect(api.post).toHaveBeenCalledWith("gems", mockPayload, undefined);
    expect(data).toEqual(mockResponse);
  });

  it("should execute PUT request and return data", async () => {
    const mockPayload = { name: "Sapphire" };
    const mockResponse = { id: 3, name: "Sapphire" };
    vi.spyOn(api, "put").mockResolvedValue({
      data: mockResponse,
    } as AxiosResponse);

    const data = await httpClient.put<{ id: number; name: string }>(
      "gems/3",
      mockPayload,
    );
    expect(api.put).toHaveBeenCalledWith("gems/3", mockPayload, undefined);
    expect(data).toEqual(mockResponse);
  });

  it("should execute PATCH request and return data", async () => {
    const mockPayload = { name: "Emerald" };
    const mockResponse = { id: 4, name: "Emerald" };
    vi.spyOn(api, "patch").mockResolvedValue({
      data: mockResponse,
    } as AxiosResponse);

    const data = await httpClient.patch<{ id: number; name: string }>(
      "gems/4",
      mockPayload,
    );
    expect(api.patch).toHaveBeenCalledWith("gems/4", mockPayload, undefined);
    expect(data).toEqual(mockResponse);
  });

  it("should execute DELETE request and return data", async () => {
    const mockResponse = { success: true };
    vi.spyOn(api, "delete").mockResolvedValue({
      data: mockResponse,
    } as AxiosResponse);

    const data = await httpClient.delete<{ success: boolean }>("gems/1");
    expect(api.delete).toHaveBeenCalledWith("gems/1", undefined);
    expect(data).toEqual(mockResponse);
  });
});

describe("api interceptors", () => {
  const requestInterceptor = (
    api.interceptors
      .request as unknown as InterceptorManagerShim<InternalAxiosRequestConfig>
  ).handlers[0]!;
  const responseInterceptor = (
    api.interceptors
      .response as unknown as InterceptorManagerShim<AxiosResponse>
  ).handlers[0]!;

  const originalLocation = window.location;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();

    delete (window as unknown as Record<string, unknown>).location;
    window.location = {
      ...originalLocation,
      pathname: "/dashboard",
      href: "http://localhost/dashboard",
    } as unknown as string & Location;
  });

  afterEach(() => {
    window.location = originalLocation as string & Location;
  });

  describe("request interceptor", () => {
    it("should add Authorization header when token is present", async () => {
      setAuthToken("test-jwt-token");
      const config = { headers: {} } as InternalAxiosRequestConfig;
      const result = await requestInterceptor.fulfilled(config);

      expect(result.headers.Authorization).toBe("Bearer test-jwt-token");
    });

    it("should not add Authorization header when token is missing", async () => {
      removeAuthToken();
      const config = { headers: {} } as InternalAxiosRequestConfig;
      const result = await requestInterceptor.fulfilled(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it("should reject when request interceptor receives an error", async () => {
      const err = new Error("Request configuration failed");
      await expect(requestInterceptor.rejected!(err)).rejects.toThrow(
        "Request configuration failed",
      );
    });
  });

  describe("response interceptor", () => {
    it("should return response on success", async () => {
      const mockResponse = { status: 200, data: { ok: true } } as AxiosResponse;
      const result = await responseInterceptor.fulfilled(mockResponse);
      expect(result).toBe(mockResponse);
    });

    it("should handle 401 error and redirect to /login when not on /login page", async () => {
      setAuthToken("some-token");
      window.location.pathname = "/dashboard";
      window.location.href = "http://localhost/dashboard";

      const axiosError = {
        name: "AxiosError",
        isAxiosError: true,
        response: {
          status: 401,
          data: { message: "Unauthorized token" },
          statusText: "Unauthorized",
        },
      };

      await expect(responseInterceptor.rejected!(axiosError)).rejects.toThrow(
        ApiError,
      );

      expect(getAuthToken()).toBeNull();
      expect(window.location.href).toBe("/login");
    });

    it("should handle 401 error and NOT redirect if already on /login page", async () => {
      setAuthToken("some-token");
      window.location.pathname = "/login";
      window.location.href = "http://localhost/login";

      const axiosError = {
        name: "AxiosError",
        isAxiosError: true,
        response: {
          status: 401,
          data: { message: "Unauthorized" },
          statusText: "Unauthorized",
        },
      };

      await expect(responseInterceptor.rejected!(axiosError)).rejects.toThrow(
        ApiError,
      );

      expect(getAuthToken()).toBeNull();
      expect(window.location.href).toBe("http://localhost/login");
    });

    it("should fallback to statusText when data.message is missing", async () => {
      const axiosError = {
        name: "AxiosError",
        isAxiosError: true,
        response: {
          status: 400,
          data: {},
          statusText: "Bad Request",
        },
      };

      try {
        await responseInterceptor.rejected!(axiosError);
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        const apiErr = err as ApiError;
        expect(apiErr.status).toBe(400);
        expect(apiErr.message).toBe("Bad Request");
      }
    });

    it("should fallback to default error message when data.message and statusText are missing", async () => {
      const axiosError = {
        name: "AxiosError",
        isAxiosError: true,
        response: {
          status: 500,
          data: null,
          statusText: "",
        },
      };

      try {
        await responseInterceptor.rejected!(axiosError);
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        const apiErr = err as ApiError;
        expect(apiErr.status).toBe(500);
        expect(apiErr.message).toBe("An error occurred during the request.");
      }
    });

    it("should reject non-Axios error or error without response directly", async () => {
      const genericError = new Error("Network Error");
      await expect(responseInterceptor.rejected!(genericError)).rejects.toThrow(
        genericError,
      );

      const axiosErrorNoResponse = {
        name: "AxiosError",
        isAxiosError: true,
        response: undefined,
      };
      await expect(
        responseInterceptor.rejected!(axiosErrorNoResponse),
      ).rejects.toEqual(axiosErrorNoResponse);
    });
  });
});

describe("getBaseUrl", () => {
  const originalApiInternalUrl = process.env.API_INTERNAL_URL;
  const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  const originalWindow = globalThis.window;

  afterEach(() => {
    process.env.API_INTERNAL_URL = originalApiInternalUrl;
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;

    if (typeof originalWindow === "undefined") {
      // @ts-expect-error restoring test environment
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
  });

  it("should use /api in the browser", async () => {
    vi.resetModules();
    globalThis.window = {} as Window & typeof globalThis;
    const { api: freshApi } = await import("@/lib/api/client");
    expect(freshApi.defaults.baseURL).toBe("/api");
  });

  it("should use process.env.API_INTERNAL_URL on the server if defined", async () => {
    vi.resetModules();
    // @ts-expect-error simulating server environment
    delete globalThis.window;
    process.env.API_INTERNAL_URL = "https://custom-api.example.com/api/v1";
    const { api: freshApi } = await import("@/lib/api/client");
    expect(freshApi.defaults.baseURL).toBe(
      "https://custom-api.example.com/api/v1",
    );
  });

  it("should fallback to NEXT_PUBLIC_APP_URL/api on the server", async () => {
    vi.resetModules();
    // @ts-expect-error simulating server environment
    delete globalThis.window;
    delete process.env.API_INTERNAL_URL;
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    const { api: freshApi } = await import("@/lib/api/client");
    expect(freshApi.defaults.baseURL).toBe("http://localhost:3000/api");
  });
});
