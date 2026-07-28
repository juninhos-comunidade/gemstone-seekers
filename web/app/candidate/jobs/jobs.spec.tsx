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
  usePathname: () => "/candidate/jobs",
}));

describe("Candidate Jobs Page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the candidate jobs placeholder", () => {
    render(<Jobs />);
    expect(screen.getByText(/page vagas candidato/i)).toBeInTheDocument();
  });
});
