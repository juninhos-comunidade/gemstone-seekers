import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Login from "./page";

const mockPush = vi.fn();
const mockLogin = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/lib/api/auth/login", () => ({
  useLogin: () => ({
    mutateAsync: mockLogin,
    isPending: false,
  }),
}));

const mockUseRouter = vi.mocked(useRouter);

describe("Login Page", () => {
  const mockRouter = {
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
  });

  it("renders login form fields and signup link", () => {
    render(<Login />);

    expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "E-mail" })).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cadastre-se" })).toHaveAttribute(
      "href",
      "/signup/role",
    );
  });

  it("calls useLogin with valid form data", async () => {
    mockLogin.mockResolvedValue(undefined);

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/^e-mail$/i), {
      target: { value: "candidato@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "senha123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "candidato@example.com",
        password: "senha123",
      });
    });
  });

  it("does not call useLogin for invalid form input", async () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/^e-mail$/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});
