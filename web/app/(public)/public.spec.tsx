import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
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
  afterEach(() => {
    cleanup();
  });

  it("renders the platform badge", () => {
    render(<Home />);
    expect(
      screen.getByText(/plataforma de recrutamento para tecnologia/i),
    ).toBeInTheDocument();
  });

  it("renders the main heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/vaga ideal/i)).toBeInTheDocument();
    expect(screen.getByText(/candidato perfeito/i)).toBeInTheDocument();
  });

  it("renders the platform description", () => {
    render(<Home />);
    expect(
      screen.getByText(/conecta recrutadores e profissionais de tecnologia/i),
    ).toBeInTheDocument();
  });

  it("renders both CTA buttons", () => {
    render(<Home />);
    expect(
      screen.getByRole("button", { name: /começar agora/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /saiba mais/i }),
    ).toBeInTheDocument();
  });
});
