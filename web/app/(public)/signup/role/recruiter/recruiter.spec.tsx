import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecruiterSignup from "./page";

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
  usePathname: () => "/signup/role/recruiter",
}));

describe("Recruiter Signup Page", () => {
  it("renders recruiter profile form fields, submit button and skip link, and handles submit navigation", async () => {
    vi.clearAllMocks();
    render(<RecruiterSignup />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /informações do recrutador/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/nome da empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^cargo$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/site da empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tamanho da empresa/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /pular por enquanto/i }),
    ).toHaveAttribute("href", "/dashboard");

    fireEvent.change(screen.getByLabelText(/nome da empresa/i), {
      target: { value: "Gemstone Seekers" },
    });
    fireEvent.change(screen.getByLabelText(/^cargo$/i), {
      target: { value: "Analista de RH" },
    });
    fireEvent.change(screen.getByLabelText(/telefone/i), {
      target: { value: "(11) 99999-9999" },
    });
    fireEvent.change(screen.getByLabelText(/site da empresa/i), {
      target: { value: "https://gemstoneseekers.com" },
    });
    fireEvent.change(screen.getByLabelText(/tamanho da empresa/i), {
      target: { value: "11-50" },
    });

    const submitBtn = screen.getByRole("button", {
      name: /concluir cadastro/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/recruiter/dashboard");
    });
  });
});
