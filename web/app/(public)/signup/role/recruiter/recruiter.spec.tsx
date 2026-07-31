import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
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
  afterEach(() => {
    cleanup();
  });

  it("renders the recruiter signup heading", () => {
    render(<RecruiterSignup />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /informações do recrutador/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders all profile fields", () => {
    render(<RecruiterSignup />);

    expect(screen.getByLabelText(/nome da empresa/i)).toHaveAttribute(
      "type",
      "text",
    );
    expect(screen.getByLabelText(/^cargo$/i)).toHaveAttribute("type", "text");
    expect(screen.getByLabelText(/telefone/i)).toHaveAttribute("type", "tel");
    expect(screen.getByLabelText(/site da empresa/i)).toHaveAttribute(
      "type",
      "url",
    );
    expect(screen.getByLabelText(/tamanho da empresa/i)).toHaveAttribute(
      "type",
      "text",
    );
  });

  it("renders the submit button", () => {
    render(<RecruiterSignup />);
    expect(
      screen.getByRole("button", { name: /concluir cadastro/i }),
    ).toBeInTheDocument();
  });

  it("renders the skip link", () => {
    render(<RecruiterSignup />);
    expect(
      screen.getByText(/prefere fazer isso depois\?/i),
    ).toBeInTheDocument();
    const skipLink = screen.getByRole("link", { name: /pular por enquanto/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "/dashboard");
  });
});
