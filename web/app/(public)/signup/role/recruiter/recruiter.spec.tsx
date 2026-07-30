import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RecruiterSignup from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/signup/role/recruiter",
}));

describe("Recruiter Signup Page", () => {
  it("should renders recruiter profile form fields, submit button and skip link", () => {
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
      screen.getByRole("button", { name: /concluir cadastro/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /pular por enquanto/i }),
    ).toHaveAttribute("href", "/dashboard");
  });
});
