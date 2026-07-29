import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import Signup from "./page";

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
  usePathname: () => "/signup",
}));

describe(" Signup Page", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the  signup heading", () => {
    render(<Signup />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Criar Conta/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders all four signup fields (name, email, password, confirm)", () => {
    render(<Signup />);

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
    render(<Signup />);
    expect(
      screen.getByRole("button", { name: /cadastrar/i }),
    ).toBeInTheDocument();
  });

  it("redirects to /singup/role when profile button is clicked", () => {
    render(<Signup />);

    const singupButton = screen.getByRole("button", { name: /cadastrar/i });
    fireEvent.click(singupButton);
    expect(mockPush).toHaveBeenCalledWith("/signup/role");
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it("renders the 'already have an account' link to login", () => {
    render(<Signup />);
    expect(screen.getByText(/já possui uma conta\?/i)).toBeInTheDocument();
    const loginLink = screen.getByRole("link", { name: /entrar/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });
});
