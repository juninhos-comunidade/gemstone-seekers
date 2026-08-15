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
  it("should renders platform badge, main heading, description and CTA buttons with functional links", () => {
    render(<Home />);
    expect(
      screen.getByText(/plataforma de recrutamento para tecnologia/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/vaga ideal/i)).toBeInTheDocument();
    expect(
      screen.getByText(/conecta recrutadores e profissionais de tecnologia/i),
    ).toBeInTheDocument();

    const signupLink = screen.getByRole("link", { name: /começar agora/i });
    expect(signupLink).toHaveAttribute("href", "/signup");
    expect(
      screen.getByRole("button", { name: /começar agora/i }),
    ).toBeInTheDocument();

    const loginLink = screen.getByRole("link", { name: /acessar/i });
    expect(loginLink).toHaveAttribute("href", "/login");
    expect(
      screen.getByRole("button", { name: /acessar/i }),
    ).toBeInTheDocument();
  });
});
