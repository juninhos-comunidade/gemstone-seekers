import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
  usePathname: () => "/candidate/dashboard",
}));

describe("Candidate Dashboard Page", () => {
  it("should render the main heading and welcome paragraph", () => {
    render(<Dashboard />);
    expect(
      screen.getByRole("heading", { name: /dashboard do candidato/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/bem-vindo! em breve você poderá acompanhar/i),
    ).toBeInTheDocument();
  });
});
