import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

describe("proxy", () => {
  it("redirects to /login when accessing protected route without token", () => {
    const request = new NextRequest(
      "http://localhost:3000/candidate/dashboard",
    );

    const response = proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login",
    );
  });

  it("allows access to protected route when token cookie exists", () => {
    const request = new NextRequest(
      "http://localhost:3000/candidate/dashboard",
      {
        headers: {
          cookie: "auth_token=test-token",
        },
      },
    );

    const response = proxy(request);

    expect(response.status).toBe(200);
  });
});
