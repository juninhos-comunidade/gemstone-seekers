import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CandidateSignup from "./page";

const mockUpdateCandidate = vi.fn();

vi.mock("@/lib/api/auth/UpdateCandidate", () => ({
  useUpdateCandidate: () => ({
    mutateAsync: mockUpdateCandidate,
    isPending: false,
  }),
}));

describe("Candidate Signup Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders profile form fields, submit button and skip link, and handles submit navigation", async () => {
    mockUpdateCandidate.mockResolvedValue(undefined);

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

    fireEvent.change(screen.getByLabelText(/telefone/i), {
      target: { value: "(11) 99999-9999" },
    });
    fireEvent.change(screen.getByLabelText(/área de interesse/i), {
      target: { value: "Tecnologia" },
    });
    fireEvent.change(screen.getByLabelText(/cargo desejado/i), {
      target: { value: "Desenvolvedor Front-end" },
    });
    fireEvent.change(screen.getByLabelText(/nível de experiência/i), {
      target: { value: "Júnior" },
    });
    fireEvent.change(screen.getByLabelText(/localização/i), {
      target: { value: "São Paulo, SP" },
    });
    fireEvent.change(screen.getByLabelText(/currículo \(link\)/i), {
      target: { value: "https://linkedin.com/in/teste" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /concluir cadastro/i,
      }),
    );

    await waitFor(() => {
      expect(mockUpdateCandidate).toHaveBeenCalledWith({
        phone: "(11) 99999-9999",
        area: "Tecnologia",
        role: "Desenvolvedor Front-end",
        experience: "Júnior",
        location: "São Paulo, SP",
        resume: "https://linkedin.com/in/teste",
      });
    });
  });
});
