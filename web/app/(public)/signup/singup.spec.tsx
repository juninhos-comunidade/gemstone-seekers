import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
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
    // Mock fetch so the async submit handler resolves successfully
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the signup heading", () => {
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

  it("redirects to /signup/role when the form is submitted with valid data", async () => {
    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: "Maria Silva" },
    });
    fireEvent.change(screen.getByLabelText(/^e-mail$/i), {
      target: { value: "maria@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "123456" },
    });

    const submitButton = screen.getByRole("button", { name: /cadastrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/signup/role");
    });
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it("renders the 'already have an account' link to login", () => {
    render(<Signup />);
    expect(screen.getByText(/já possui uma conta\?/i)).toBeInTheDocument();
    const loginLink = screen.getByRole("link", { name: /entrar/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it("handleSignUp calls POST /api/signup without confirmPassword, shows success toast and redirects", async () => {
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
    expect(options.headers).toStrictEqual({
      "Content-Type": "application/json",
    });

    const body = JSON.parse(options.body as string);
    expect(body).toStrictEqual({
      fullName: "João Pedro",
      email: "joao@example.com",
      password: "abc123",
    });
    expect(body).not.toHaveProperty("confirmPassword");

    expect(mockToastSuccess).toHaveBeenCalledTimes(1);
    expect(mockToastSuccess).toHaveBeenCalledWith("Conta criada com sucesso!");

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/signup/role");

    expect(mockToastError).not.toHaveBeenCalled();
  });

  it("handleSignUp calls toast.error with server message when response is not ok and has error body", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "E-mail já cadastrado" }),
    });
    global.fetch = mockFetch as unknown as typeof fetch;

    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: "Ana Costa" },
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
      expect(mockToastError).toHaveBeenCalledTimes(1);
    });

    expect(mockToastError).toHaveBeenCalledWith("E-mail já cadastrado");
    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("handleSignUp calls toast.error with fallback message when response is not ok and json body has no message or fetch throws", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });
    global.fetch = mockFetch as unknown as typeof fetch;

    render(<Signup />);

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: "Bruno Lima" },
    });
    fireEvent.change(screen.getByLabelText(/^e-mail$/i), {
      target: { value: "bruno@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "senhaforte" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "senhaforte" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledTimes(1);
    });

    expect(mockToastError).toHaveBeenCalledWith("Falha ao cadastrar");
    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
