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
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
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
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
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

  it("does not call useSignup for invalid form input", async () => {
    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: "Jo" },
    });
    fireEvent.change(screen.getByLabelText(/^e-mail$/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(mockSignup).not.toHaveBeenCalled();
    });
  });
});
