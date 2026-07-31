import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Login from "./page";

const mockPush = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockSetAuthToken = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

vi.mock("@/lib/api/auth", () => ({
  setAuthToken: (...args: unknown[]) => mockSetAuthToken(...args),
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
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

  it("saves token and navigates to candidate dashboard on valid form submission", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        result: {
          token: "jwt-token-123",
        },
      }),
    } as Response);

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/^e-mail$/i), {
      target: { value: "candidato@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "senha123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "candidato@example.com",
          password: "senha123",
        }),
      });
      expect(mockSetAuthToken).toHaveBeenCalledWith("jwt-token-123");
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Login realizado com sucesso!",
      );
      expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
    });
  });

  it("navigates even when the login succeeds without token in response body", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        result: {
          user: {
            id: "123",
          },
        },
      }),
    } as Response);

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/^e-mail$/i), {
      target: { value: "candidato@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "senha123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(mockSetAuthToken).not.toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Login realizado com sucesso!",
      );
      expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
    });
  });

  it("does not submit or navigate for invalid form input", async () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/^e-mail$/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });

    expect(mockPush).not.toHaveBeenCalled();
    expect(mockToastSuccess).not.toHaveBeenCalled();
  });
});
