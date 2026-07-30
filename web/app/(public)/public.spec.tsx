import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("Public Home Page", () => {
  it("should renders platform badge, main heading, description and CTA buttons", () => {
    render(<Home />);
    expect(
      screen.getByText(/plataforma de recrutamento para tecnologia/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/vaga ideal/i)).toBeInTheDocument();
    expect(
      screen.getByText(/conecta recrutadores e profissionais de tecnologia/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /começar agora/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /saiba mais/i }),
    ).toBeInTheDocument();
  });
});
