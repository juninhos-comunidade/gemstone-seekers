import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
  it("should renders profile form fields, submit button and skip link", () => {
    render(<CandidateSignup />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Informações do Candidato/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/área de interesse/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cargo desejado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nível de experiência/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/localização/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/currículo \(link\)/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /concluir cadastro/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /pular por enquanto/i }),
    ).toHaveAttribute("href", "/dashboard");
  });
});
