import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { useLogin, loginRequest } from "./login";

const mockUseRouter = vi.fn();
const mockUseMutation = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockSetAuthToken = vi.fn();
const mockSetUserRole = vi.fn();
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
  setUserRole: (...args: unknown[]) => mockSetUserRole(...args),
}));

vi.mock("@/lib/api/client", () => ({
  httpClient: {
    post: (...args: unknown[]) => mockHttpPost(...args),
  },
}));

describe("useLogin and loginRequest", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseMutation.mockImplementation((options) => options);
  });

  describe("loginRequest", () => {
    it("configures mutation and executes login request", async () => {
      mockHttpPost.mockResolvedValueOnce({
        success: true,
        message: "ok",
        result: {
          accessToken: "token",
          refreshToken: "ref",
          registrationCompleted: true,
          role: "CANDIDATE",
        },
      });

      const response = await loginRequest({
        email: "user@example.com",
        password: "123456",
      });

      expect(mockHttpPost).toHaveBeenCalledWith("/auth/login", {
        email: "user@example.com",
        password: "123456",
      });
      expect(response.success).toBe(true);
    });
  });

  describe("useLogin hook", () => {
    it("redirects completed candidate to candidate dashboard with custom message", () => {
      const mutation = useLogin();

      mutation.onSuccess({
        success: true,
        message: "Bem vindo!",
        result: {
          accessToken: "jwt-candidate",
          refreshToken: "refresh",
          registrationCompleted: true,
          role: "CANDIDATE",
        },
      });

      expect(mockSetAuthToken).toHaveBeenCalledWith("jwt-candidate");
      expect(mockSetUserRole).toHaveBeenCalledWith("CANDIDATE");
      expect(mockToastSuccess).toHaveBeenCalledWith("Bem vindo!");
      expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
    });

    it("redirects completed recruiter to recruiter dashboard with default message", () => {
      const mutation = useLogin();

      mutation.onSuccess({
        success: true,
        result: {
          accessToken: "jwt-recruiter",
          refreshToken: "refresh",
          registrationCompleted: true,
          role: "RECRUITER",
        },
      });

      expect(mockSetAuthToken).toHaveBeenCalledWith("jwt-recruiter");
      expect(mockSetUserRole).toHaveBeenCalledWith("RECRUITER");
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Login realizado com sucesso!",
      );
      expect(mockPush).toHaveBeenCalledWith("/recruiter/dashboard");
    });

    it("redirects incomplete registration to /role to select profile", () => {
      const mutation = useLogin();

      mutation.onSuccess({
        success: true,
        result: {
          accessToken: "jwt-token",
          refreshToken: "refresh-token",
          registrationCompleted: false,
          role: null,
        },
      });

      expect(mockSetAuthToken).toHaveBeenCalledWith("jwt-token");
      expect(mockSetUserRole).not.toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Login realizado com sucesso!",
      );
      expect(mockPush).toHaveBeenCalledWith("/role");
    });

    it("handles failure when success is false with message", () => {
      const mutation = useLogin();

      mutation.onSuccess({
        success: false,
        message: "Credenciais inválidas",
      });

      expect(mockToastError).toHaveBeenCalledWith("Credenciais inválidas");
      expect(mockSetAuthToken).not.toHaveBeenCalled();
      expect(mockSetUserRole).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("handles failure when success is false without message", () => {
      const mutation = useLogin();

      mutation.onSuccess({
        success: false,
      });

      expect(mockToastError).toHaveBeenCalledWith("Erro ao fazer login");
    });

    it("handles missing token in successful response", () => {
      const mutation = useLogin();

      mutation.onSuccess({
        success: true,
        result: {},
      });

      expect(mockToastError).toHaveBeenCalledWith(
        "Não foi possível autenticar. Tente novamente.",
      );
      expect(mockSetAuthToken).not.toHaveBeenCalled();
      expect(mockSetUserRole).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("handles timeout error in onError", () => {
      const mutation = useLogin();

      mutation.onError(new Error("timeout of 10000ms exceeded"));

      expect(mockToastError).toHaveBeenCalledWith(
        "O servidor está iniciando, isso pode levar até 1 minuto. Tente novamente.",
      );
    });

    it("handles ApiError in onError", () => {
      const mutation = useLogin();

      mutation.onError(
        new ApiError(401, "Credenciais inválidas", {
          success: false,
          message: "Credenciais inválidas",
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Credenciais inválidas",
          },
        }),
      );

      expect(mockToastError).toHaveBeenCalledWith("Credenciais inválidas");
    });

    it("handles generic Error in onError", () => {
      const mutation = useLogin();

      mutation.onError(new Error("Erro inesperado"));

      expect(mockToastError).toHaveBeenCalledWith("Erro inesperado");
    });

    it("handles empty error in onError with fallback", () => {
      const mutation = useLogin();

      mutation.onError({} as Error);

      expect(mockToastError).toHaveBeenCalledWith(
        "Ocorreu um erro ao realizar o login.",
      );
    });

    it("handles null/undefined error in onError gracefully", () => {
      const mutation = useLogin();

      mutation.onError(null as unknown as Error);

      expect(mockToastError).toHaveBeenCalledWith(
        "Ocorreu um erro ao realizar o login.",
      );
    });
  });
});
