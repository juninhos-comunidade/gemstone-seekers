import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Dashboard from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/recruiter/dashboard",
}));

describe("Recruiter Dashboard Page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the main heading", () => {
    render(<Dashboard />);
    expect(
      screen.getByRole("heading", { name: /dashboard do recrutador/i }),
    ).toBeInTheDocument();
  });

  it("renders the welcome paragraph", () => {
    render(<Dashboard />);
    expect(
      screen.getByText(/bem-vindo! em breve você poderá acompanhar/i),
    ).toBeInTheDocument();
  });
});
