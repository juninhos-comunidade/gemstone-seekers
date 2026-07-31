import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders profile form fields, submit button and skip link, and handles submit navigation", async () => {
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

    const submitBtn = screen.getByRole("button", {
      name: /concluir cadastro/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/candidate/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: "(11) 99999-9999",
          area: "Tecnologia",
          role: "Desenvolvedor Front-end",
          experience: "Júnior",
          location: "São Paulo, SP",
          resume: "https://linkedin.com/in/teste",
        }),
      });
      expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
    });
  });
});
