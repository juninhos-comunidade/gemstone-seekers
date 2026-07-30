import { describe, it, expect, beforeEach } from "vitest";
import { setAuthToken, getAuthToken, removeAuthToken } from "@/lib/api/auth";

describe("auth helpers (lib/api/auth.ts)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return null when no token is saved", () => {
    expect(getAuthToken()).toBeNull();
  });

  it("should store and retrieve the JWT token correctly in localStorage", () => {
    setAuthToken("test-jwt-token-123");
    expect(getAuthToken()).toBe("test-jwt-token-123");
  });

  it("should remove the JWT token from localStorage", () => {
    setAuthToken("test-jwt-token-123");
    removeAuthToken();
    expect(getAuthToken()).toBeNull();
  });
});
