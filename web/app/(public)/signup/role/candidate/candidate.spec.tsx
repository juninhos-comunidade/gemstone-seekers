import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import CandidateSignup from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/signup/role/candidate",
}));

describe("Candidate Signup Page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the candidate signup heading", () => {
    render(<CandidateSignup />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Informações do Candidato/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders all profile fields", () => {
    render(<CandidateSignup />);

    expect(screen.getByLabelText(/telefone/i)).toHaveAttribute("type", "tel");
    expect(screen.getByLabelText(/área de interesse/i)).toHaveAttribute(
      "type",
      "text",
    );
    expect(screen.getByLabelText(/cargo desejado/i)).toHaveAttribute(
      "type",
      "text",
    );
    expect(screen.getByLabelText(/nível de experiência/i)).toHaveAttribute(
      "type",
      "text",
    );
    expect(screen.getByLabelText(/localização/i)).toHaveAttribute(
      "type",
      "text",
    );
    expect(screen.getByLabelText(/currículo \(link\)/i)).toHaveAttribute(
      "type",
      "url",
    );
  });

  it("renders the submit button", () => {
    render(<CandidateSignup />);
    expect(
      screen.getByRole("button", { name: /concluir cadastro/i }),
    ).toBeInTheDocument();
  });

  it("renders the skip link", () => {
    render(<CandidateSignup />);
    expect(
      screen.getByText(/prefere fazer isso depois\?/i),
    ).toBeInTheDocument();
    const skipLink = screen.getByRole("link", { name: /pular por enquanto/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "/dashboard");
  });
});
