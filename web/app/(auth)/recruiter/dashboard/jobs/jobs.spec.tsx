import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
  it("should renders the recruiter jobs placeholder", () => {
    render(<Jobs />);
    expect(screen.getByText(/vagas de recrutamento/i)).toBeInTheDocument();
  });
});
