import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
  it("should render the texts placeholder", () => {
    render(<Tests />);
    expect(screen.getByText(/page testes candidato/i)).toBeInTheDocument();
  });
});
