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
  usePathname: () => "/candidate/jobs",
}));

describe("Candidate Jobs Page", () => {
  it("renders the candidate jobs placeholder", () => {
    render(<Jobs />);
    expect(screen.getByText(/page vagas candidato/i)).toBeInTheDocument();
  });
});
