import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockPost = vi.fn();

vi.mock("@/lib/api/client", () => ({
  httpClient: {
    post: (...args: unknown[]) => mockPost(...args),
  },
}));

describe("proxy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows public routes without token", async () => {
    const { proxy } = await import("./proxy");
    const request = new NextRequest("http://localhost:3000/login");

    const response = await proxy(request);

    expect(response.status).toBe(200);
    expect(mockPost).not.toHaveBeenCalled();
  });

  it("redirects to /login when accessing protected route without auth and refresh token", async () => {
    const { proxy } = await import("./proxy");
    const request = new NextRequest(
      "http://localhost:3000/candidate/dashboard",
    );

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login",
    );
  });

  it("allows access to protected route when auth token cookie exists and no role is set", async () => {
    const { proxy } = await import("./proxy");
    const request = new NextRequest(
      "http://localhost:3000/candidate/dashboard",
      {
        headers: {
          cookie: "auth_token=test-token",
        },
      },
    );

    const response = await proxy(request);

    expect(response.status).toBe(200);
    expect(mockPost).not.toHaveBeenCalled();
  });

  it("allows access when CANDIDATE accesses candidate routes", async () => {
    const { proxy } = await import("./proxy");
    const request = new NextRequest(
      "http://localhost:3000/candidate/dashboard",
      {
        headers: {
          cookie: "auth_token=test-token; user_role=CANDIDATE",
        },
      },
    );

    const response = await proxy(request);

    expect(response.status).toBe(200);
    expect(mockPost).not.toHaveBeenCalled();
  });

  it("allows access when RECRUITER accesses recruiter routes", async () => {
    const { proxy } = await import("./proxy");
    const request = new NextRequest(
      "http://localhost:3000/recruiter/dashboard",
      {
        headers: {
          cookie: "auth_token=test-token; user_role=RECRUITER",
        },
      },
    );

    const response = await proxy(request);

    expect(response.status).toBe(200);
    expect(mockPost).not.toHaveBeenCalled();
  });

  it("redirects RECRUITER to recruiter dashboard when accessing candidate route", async () => {
    const { proxy } = await import("./proxy");
    const request = new NextRequest(
      "http://localhost:3000/candidate/dashboard",
      {
        headers: {
          cookie: "auth_token=test-token; user_role=RECRUITER",
        },
      },
    );

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/recruiter/dashboard",
    );
  });

  it("redirects CANDIDATE to candidate dashboard when accessing recruiter route", async () => {
    const { proxy } = await import("./proxy");
    const request = new NextRequest(
      "http://localhost:3000/recruiter/dashboard",
      {
        headers: {
          cookie: "auth_token=test-token; user_role=CANDIDATE",
        },
      },
    );

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/candidate/dashboard",
    );
  });

  it("allows access to /role route for any role with auth token", async () => {
    const { proxy } = await import("./proxy");
    const request = new NextRequest("http://localhost:3000/role", {
      headers: {
        cookie: "auth_token=test-token; user_role=CANDIDATE",
      },
    });

    const response = await proxy(request);

    expect(response.status).toBe(200);
    expect(mockPost).not.toHaveBeenCalled();
  });

  it("tries to refresh token and sets a new auth cookie when refresh succeeds for authorized role", async () => {
    mockPost.mockResolvedValue({
      success: true,
      result: {
        accessToken: "new-access-token",
      },
    });

    const { proxy } = await import("./proxy");
    const request = new NextRequest(
      "http://localhost:3000/recruiter/dashboard",
      {
        headers: {
          cookie: "refresh_token=valid-refresh-token; user_role=RECRUITER",
        },
      },
    );

    const response = await proxy(request);

    expect(mockPost).toHaveBeenCalledWith("auth/refresh", {
      data: { refreshToken: "valid-refresh-token" },
    });
    expect(response.status).toBe(200);
    expect(response.cookies.get("auth_token")?.value).toBe("new-access-token");
  });

  it("refreshes token and redirects RECRUITER when accessing candidate route", async () => {
    mockPost.mockResolvedValue({
      success: true,
      result: {
        accessToken: "new-access-token",
      },
    });

    const { proxy } = await import("./proxy");
    const request = new NextRequest(
      "http://localhost:3000/candidate/dashboard",
      {
        headers: {
          cookie: "refresh_token=valid-refresh-token; user_role=RECRUITER",
        },
      },
    );

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/recruiter/dashboard",
    );
    expect(response.cookies.get("auth_token")?.value).toBe("new-access-token");
  });

  it("refreshes token and redirects CANDIDATE when accessing recruiter route", async () => {
    mockPost.mockResolvedValue({
      success: true,
      result: {
        accessToken: "new-access-token",
      },
    });

    const { proxy } = await import("./proxy");
    const request = new NextRequest(
      "http://localhost:3000/recruiter/dashboard",
      {
        headers: {
          cookie: "refresh_token=valid-refresh-token; user_role=CANDIDATE",
        },
      },
    );

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/candidate/dashboard",
    );
    expect(response.cookies.get("auth_token")?.value).toBe("new-access-token");
  });

  it("redirects to /login when refresh does not return a new access token", async () => {
    mockPost.mockResolvedValue({
      success: true,
      result: {},
    });

    const { proxy } = await import("./proxy");
    const request = new NextRequest(
      "http://localhost:3000/recruiter/dashboard",
      {
        headers: {
          cookie: "refresh_token=valid-refresh-token",
        },
      },
    );

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login",
    );
  });

  it("redirects to /login when refresh request throws", async () => {
    mockPost.mockRejectedValue(new Error("refresh failed"));

    const { proxy } = await import("./proxy");
    const request = new NextRequest(
      "http://localhost:3000/recruiter/dashboard",
      {
        headers: {
          cookie: "refresh_token=invalid-refresh-token",
        },
      },
    );

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login",
    );
  });
});
