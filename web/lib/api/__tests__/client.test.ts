import { describe, it, expect, vi, beforeEach } from "vitest";
import { httpClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { setAuthToken } from "@/lib/api/auth";

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

  it("should execute GET request with success and return JSON", async () => {
    const mockData = { id: 1, name: "Gemstone" };
    const mockResponse = new Response(JSON.stringify(mockData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    const data = await httpClient.get<{ id: number; name: string }>("gems/1");
    expect(data).toEqual(mockData);
  });

  it("should include the Authorization header with Bearer token when it exists", async () => {
    setAuthToken("my-secret-jwt");
    const mockData = { ok: true };
    const mockResponse = new Response(JSON.stringify(mockData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(mockResponse);

    await httpClient.get("gems/1");

    expect(fetchSpy).toHaveBeenCalled();
    const request = fetchSpy.mock.calls[0][0] as Request;
    expect(request.headers.get("Authorization")).toBe("Bearer my-secret-jwt");
  });

  it("should convert HTTP errors to ApiError", async () => {
    const errorPayload = { message: "Resource not found" };
    const mockResponse = new Response(JSON.stringify(errorPayload), {
      status: 404,
      statusText: "Not Found",
      headers: { "Content-Type": "application/json" },
    });

    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse);

    await expect(httpClient.get("gems/999")).rejects.toThrow(ApiError);
  });
});
