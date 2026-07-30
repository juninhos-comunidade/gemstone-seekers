import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Tests from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/candidate/tests",
}));

describe("Candidate Tests Page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the candidate tests placeholder", () => {
    render(<Tests />);
    expect(screen.getByText(/page testes candidato/i)).toBeInTheDocument();
  });
});
