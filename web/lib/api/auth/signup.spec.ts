import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSignup, signupRequest } from "./signup";

const mockUseRouter = vi.fn();
const mockUseMutation = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockSetAuthToken = vi.fn();
const mockHttpPost = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => mockUseRouter(),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: (options: unknown) => mockUseMutation(options),
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

vi.mock("@/lib/api/client", () => ({
  httpClient: {
    post: (...args: unknown[]) => mockHttpPost(...args),
  },
}));

describe("useSignup and signupRequest", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseMutation.mockImplementation((options) => options);
  });

  describe("signupRequest", () => {
    it("calls /auth/register and performs auto-login returning token on success", async () => {
      mockHttpPost
        .mockResolvedValueOnce({
          success: true,
          message: "User registered",
          result: { id: "1", name: "João Silva", email: "joao@example.com" },
        })
        .mockResolvedValueOnce({
          success: true,
          message: "Login successful",
          result: {
            accessToken: "valid-access-token",
            refreshToken: "valid-refresh-token",
            registrationCompleted: false,
          },
        });

      const response = await signupRequest({
        fullName: "João Silva",
        email: "joao@example.com",
        password: "secretpassword",
        confirmPassword: "secretpassword",
      });

      expect(mockHttpPost).toHaveBeenNthCalledWith(1, "/auth/register", {
        name: "João Silva",
        email: "joao@example.com",
        password: "secretpassword",
      });
      expect(mockHttpPost).toHaveBeenNthCalledWith(2, "/auth/login", {
        email: "joao@example.com",
        password: "secretpassword",
      });
      expect(response.success).toBe(true);
      expect(response.token).toBe("valid-access-token");
    });

    it("skips auto-login when registration fails (success: false)", async () => {
      mockHttpPost.mockResolvedValueOnce({
        success: false,
        message: "Email já cadastrado",
      });

      const response = await signupRequest({
        fullName: "João Silva",
        email: "joao@example.com",
        password: "secretpassword",
      });

      expect(mockHttpPost).toHaveBeenCalledTimes(1);
      expect(response.success).toBe(false);
      expect(response.token).toBeUndefined();
    });

    it("returns original response without token when auto-login fails (success: false)", async () => {
      mockHttpPost
        .mockResolvedValueOnce({
          success: true,
          result: { id: "1", name: "João", email: "joao@example.com" },
        })
        .mockResolvedValueOnce({
          success: false,
          message: "Login failed",
        });

      const response = await signupRequest({
        fullName: "João Silva",
        email: "joao@example.com",
        password: "secretpassword",
      });

      expect(mockHttpPost).toHaveBeenCalledTimes(2);
      expect(response.token).toBeUndefined();
    });

    it("returns original response without token when auto-login throws an error", async () => {
      mockHttpPost
        .mockResolvedValueOnce({
          success: true,
          result: { id: "1", name: "João", email: "joao@example.com" },
        })
        .mockRejectedValueOnce(new Error("Network failure during login"));

      const response = await signupRequest({
        fullName: "João Silva",
        email: "joao@example.com",
        password: "secretpassword",
      });

      expect(mockHttpPost).toHaveBeenCalledTimes(2);
      expect(response.token).toBeUndefined();
    });
  });

  describe("useSignup hook", () => {
    it("handles onSuccess with token by setting auth token, displaying toast and redirecting to /role", () => {
      const mutation = useSignup();

      mutation.onSuccess({
        success: true,
        token: "jwt-token-123",
      });

      expect(mockSetAuthToken).toHaveBeenCalledWith("jwt-token-123");
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Conta criada com sucesso!",
      );
      expect(mockPush).toHaveBeenCalledWith("/role");
    });

    it("handles onSuccess without token by displaying error toast and redirecting to /login", () => {
      const mutation = useSignup();

      mutation.onSuccess({
        success: true,
      });

      expect(mockSetAuthToken).not.toHaveBeenCalled();
      expect(mockToastError).toHaveBeenCalledWith(
        "Conta criada, mas não foi possível autenticar automaticamente. Faça login.",
      );
      expect(mockPush).toHaveBeenCalledWith("/login");
    });

    it("handles onSuccess when response has success: false with custom message", () => {
      const mutation = useSignup();

      mutation.onSuccess({
        success: false,
        message: "Email já utilizado",
      });

      expect(mockToastError).toHaveBeenCalledWith("Email já utilizado");
      expect(mockSetAuthToken).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("handles onSuccess when response has success: false without message", () => {
      const mutation = useSignup();

      mutation.onSuccess({
        success: false,
      });

      expect(mockToastError).toHaveBeenCalledWith("Falha ao cadastrar");
      expect(mockSetAuthToken).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("handles onError with timeout error and shows server starting message", () => {
      const mutation = useSignup();

      mutation.onError(new Error("timeout of 10000ms exceeded"));

      expect(mockToastError).toHaveBeenCalledWith(
        "O servidor está iniciando, isso pode levar até 1 minuto. Tente novamente.",
      );
    });

    it("handles onError with network or econnaborted error", () => {
      const mutation = useSignup();

      mutation.onError(new Error("ECONNABORTED"));

      expect(mockToastError).toHaveBeenCalledWith(
        "O servidor está iniciando, isso pode levar até 1 minuto. Tente novamente.",
      );
    });

    it("handles onError with custom error message", () => {
      const mutation = useSignup();

      mutation.onError(new Error("Email já cadastrado no sistema"));

      expect(mockToastError).toHaveBeenCalledWith(
        "Email já cadastrado no sistema",
      );
    });

    it("handles onError with fallback error message when error has no message or is empty", () => {
      const mutation = useSignup();

      mutation.onError({} as Error);

      expect(mockToastError).toHaveBeenCalledWith("Falha ao cadastrar");
    });

    it("handles onError with null/undefined error gracefully", () => {
      const mutation = useSignup();

      mutation.onError(null as unknown as Error);

      expect(mockToastError).toHaveBeenCalledWith("Falha ao cadastrar");
    });
  });
});
