import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Jobs from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/recruiter/jobs",
}));

describe("Recruiter Jobs Page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the recruiter jobs placeholder", () => {
    render(<Jobs />);
    expect(screen.getByText(/vagas de recrutamento/i)).toBeInTheDocument();
  });
});
