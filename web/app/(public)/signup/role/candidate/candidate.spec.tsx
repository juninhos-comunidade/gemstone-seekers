import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CandidateSignup from "./page";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/signup/role/candidate",
}));

describe("Candidate Signup Page", () => {
  it("renders profile form fields, submit button and skip link, and handles submit navigation", () => {
    vi.clearAllMocks();
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
      screen.getByRole("link", { name: /pular por enquanto/i }),
    ).toHaveAttribute("href", "/dashboard");

    const submitBtn = screen.getByRole("button", {
      name: /concluir cadastro/i,
    });
    fireEvent.click(submitBtn);

    expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
  });
});
