import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import AuthLayout from "./layout";

vi.mock("@/components/DashboardHeader/DashboardHeader", () => ({
  DashboardHeader: () => (
    <header data-testid="mock-auth-header">
      <span>Mocked Auth Header</span>
    </header>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
}));

describe("Auth Layout", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the auth header", () => {
    render(
      <AuthLayout>
        <div>Mocked Children</div>
      </AuthLayout>,
    );
    expect(screen.getByTestId("mock-auth-header")).toBeInTheDocument();
  });
});
