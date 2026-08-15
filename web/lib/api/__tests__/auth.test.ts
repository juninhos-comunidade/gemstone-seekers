import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  getUserRole,
  setUserRole,
  removeUserRole,
  logout,
} from "@/lib/api/auth";

describe("auth helpers (lib/api/auth.ts)", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = "auth_token=; path=/; max-age=0";
    document.cookie = "user_role=; path=/; max-age=0";
    document.cookie = "refresh_token=; path=/; max-age=0";
  });

  describe("token management", () => {
    it("should return null when no token is saved", () => {
      expect(getAuthToken()).toBeNull();
    });

    it("should store and retrieve the JWT token correctly in localStorage", () => {
      setAuthToken("test-jwt-token-123");
      expect(getAuthToken()).toBe("test-jwt-token-123");
    });

    it("should retrieve the JWT token from cookie if localStorage is empty", () => {
      document.cookie = "auth_token=cookie-jwt-token; path=/";
      expect(getAuthToken()).toBe("cookie-jwt-token");
    });

    it("should remove the JWT token from localStorage and cookie", () => {
      setAuthToken("test-jwt-token-123");
      removeAuthToken();
      expect(getAuthToken()).toBeNull();
    });
  });

  describe("user role management", () => {
    it("should return null when no role is saved", () => {
      expect(getUserRole()).toBeNull();
    });

    it("should store and retrieve CANDIDATE role from localStorage", () => {
      setUserRole("CANDIDATE");
      expect(getUserRole()).toBe("CANDIDATE");
    });

    it("should store and retrieve RECRUITER role from localStorage", () => {
      setUserRole("RECRUITER");
      expect(getUserRole()).toBe("RECRUITER");
    });

    it("should retrieve role from cookie if localStorage is empty", () => {
      document.cookie = "user_role=CANDIDATE; path=/";
      expect(getUserRole()).toBe("CANDIDATE");
    });

    it("should return null when cookie role is invalid", () => {
      document.cookie = "user_role=ADMIN; path=/";
      expect(getUserRole()).toBeNull();
    });

    it("should remove the user role from localStorage and cookie", () => {
      setUserRole("RECRUITER");
      removeUserRole();
      expect(getUserRole()).toBeNull();
    });
  });

  describe("logout", () => {
    it("should clear tokens, role, signup-role and redirect to /login", () => {
      const originalLocation = window.location;
      // @ts-expect-error mocking window.location
      delete window.location;
      // @ts-expect-error mocking window.location
      window.location = { href: "" };

      setAuthToken("token-to-clear");
      setUserRole("CANDIDATE");
      localStorage.setItem("signup-role", "candidate");
      localStorage.setItem("refresh_token", "ref-token");

      logout();

      expect(getAuthToken()).toBeNull();
      expect(getUserRole()).toBeNull();
      expect(localStorage.getItem("signup-role")).toBeNull();
      expect(localStorage.getItem("refresh_token")).toBeNull();
      expect(window.location.href).toBe("/login");

      window.location = originalLocation;
    });
  });

  describe("when running in server environment (window is undefined)", () => {
    const originalWindow = globalThis.window;

    afterEach(() => {
      globalThis.window = originalWindow;
    });

    it("returns null for getAuthToken/getUserRole, and safely ignores set/remove/logout calls", () => {
      // @ts-expect-error simulating SSR environment where window is undefined
      delete globalThis.window;

      expect(getAuthToken()).toBeNull();
      expect(getUserRole()).toBeNull();
      expect(() => setAuthToken("test-token")).not.toThrow();
      expect(() => removeAuthToken()).not.toThrow();
      expect(() => setUserRole("CANDIDATE")).not.toThrow();
      expect(() => removeUserRole()).not.toThrow();
      expect(() => logout()).not.toThrow();
    });
  });
});
