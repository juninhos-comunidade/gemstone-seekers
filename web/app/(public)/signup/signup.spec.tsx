import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "./page";

const mockPush = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

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

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
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

  it("submits valid form data to POST /api/signup, triggers toast and redirects", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    global.fetch = mockFetch as unknown as typeof fetch;

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
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    const [url, options] = mockFetch.mock.calls[0] as [
      string,
      { method?: string; headers?: Record<string, string>; body?: string },
    ];

    expect(url).toBe("/api/signup");
    expect(options.method).toBe("POST");
    const body = JSON.parse(options.body as string);
    expect(body).toStrictEqual({
      fullName: "João Pedro",
      email: "joao@example.com",
      password: "abc123",
    });
    expect(body).not.toHaveProperty("confirmPassword");

    expect(mockToastSuccess).toHaveBeenCalledWith("Conta criada com sucesso!");
    expect(mockPush).toHaveBeenCalledWith("/signup/role");
  });

  it("shows server error message when response is not ok", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "E-mail já cadastrado" }),
    });
    global.fetch = mockFetch as unknown as typeof fetch;

    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: "Ana" },
    });
    fireEvent.change(screen.getByLabelText(/^e-mail$/i), {
      target: { value: "ana@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("E-mail já cadastrado");
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("handles non-JSON server error response with fallback message", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });
    global.fetch = mockFetch as unknown as typeof fetch;

    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: "Bruno" },
    });
    fireEvent.change(screen.getByLabelText(/^e-mail$/i), {
      target: { value: "bruno@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Falha ao cadastrar");
    });
  });

  it("handles unexpected non-Error throws", async () => {
    const mockFetch = vi.fn().mockRejectedValue("unexpected string throw");
    global.fetch = mockFetch as unknown as typeof fetch;

    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: "Carlos" },
    });
    fireEvent.change(screen.getByLabelText(/^e-mail$/i), {
      target: { value: "carlos@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Erro inesperado");
    });
  });
});
