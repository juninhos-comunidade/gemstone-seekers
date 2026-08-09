import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "./page";

const mockSignup = vi.fn();

vi.mock("@/lib/api/auth/signup", () => ({
  useSignup: () => ({
    mutateAsync: mockSignup,
    isPending: false,
  }),
}));

describe("Signup Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the signup form elements and login link", () => {
    render(<Signup />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Criar Conta/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^e-mail$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/show password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cadastrar/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /entrar/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("calls useSignup with valid form data", async () => {
    mockSignup.mockResolvedValue(undefined);

    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: "João Pedro" },
    });
    fireEvent.change(screen.getByLabelText(/^e-mail$/i), {
      target: { value: "joao@example.com" },
    });

    const passwordInputs = document.querySelectorAll("input[type='password']");
    fireEvent.change(passwordInputs[0], {
      target: { value: "abc123" },
    });
    fireEvent.change(passwordInputs[1], {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        fullName: "João Pedro",
        email: "joao@example.com",
        password: "abc123",
        confirmPassword: "abc123",
      });
    });
  });

  it("does not call useSignup and displays validation error messages for invalid input", async () => {
    const { container } = render(<Signup />);

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: "Jo" },
    });
    fireEvent.change(screen.getByLabelText(/^e-mail$/i), {
      target: { value: "invalid-email" },
    });

    const passwordInputs = document.querySelectorAll("input[type='password']");
    fireEvent.change(passwordInputs[0], {
      target: { value: "123456" },
    });
    fireEvent.change(passwordInputs[1], {
      target: { value: "654321" },
    });

    const form = container.querySelector("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockSignup).not.toHaveBeenCalled();
      expect(
        screen.getByText("Nome completo é obrigatório"),
      ).toBeInTheDocument();
      expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
      expect(screen.getByText("Senhas não coincidem")).toBeInTheDocument();
    });
  });
});
