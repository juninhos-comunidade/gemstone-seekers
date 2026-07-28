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
        name: /criar conta recrutador/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders all four signup fields (name, email, password, confirm)", () => {
    render(<RecruiterSignup />);

    const fullName = screen.getByLabelText(/nome completo/i);
    const email = screen.getByLabelText(/^e-mail$/i);
    const password = screen.getByLabelText(/^senha$/i);
    const confirmPassword = screen.getByLabelText(/confirmar senha/i);

    expect(fullName).toBeInTheDocument();
    expect(fullName).toHaveAttribute("type", "text");
    expect(email).toBeInTheDocument();
    expect(email).toHaveAttribute("type", "email");
    expect(password).toBeInTheDocument();
    expect(password).toHaveAttribute("type", "password");
    expect(confirmPassword).toBeInTheDocument();
    expect(confirmPassword).toHaveAttribute("type", "password");
  });

  it("renders the submit button", () => {
    render(<RecruiterSignup />);
    expect(
      screen.getByRole("button", { name: /cadastrar/i }),
    ).toBeInTheDocument();
  });

  it("renders the 'already have an account' link to login", () => {
    render(<RecruiterSignup />);
    expect(screen.getByText(/já possui uma conta\?/i)).toBeInTheDocument();
    const loginLink = screen.getByRole("link", { name: /entrar/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });
});
