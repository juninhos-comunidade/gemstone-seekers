import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { useLogin } from "./login";

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

describe("useLogin", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseMutation.mockImplementation((options) => options);
  });

  it("configures mutation and executes login request", async () => {
    const mutation = useLogin();
    mockHttpPost.mockResolvedValueOnce({
      message: "ok",
      result: { accessToken: "token", refreshToken: "ref", role: "CANDIDATE" },
    });

    await mutation.mutationFn({
      email: "user@example.com",
      password: "123456",
    });

    expect(mockHttpPost).toHaveBeenCalledWith("/auth/login", {
      email: "user@example.com",
      password: "123456",
    });
  });

  it("redirects completed candidate to candidate dashboard with custom message", () => {
    const mutation = useLogin();

    mutation.onSuccess({
      message: "Bem vindo!",
      result: {
        accessToken: "jwt-candidate",
        role: "CANDIDATE",
        refreshToken: "refresh",
        registrationCompleted: true,
      },
    });

    expect(mockSetAuthToken).toHaveBeenCalledWith("jwt-candidate");
    expect(mockToastSuccess).toHaveBeenCalledWith("Bem vindo!");
    expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
  });

  it("redirects completed recruiter to recruiter dashboard with default message", () => {
    const mutation = useLogin();

    mutation.onSuccess({
      result: {
        accessToken: "jwt-recruiter",
        role: "RECRUITER",
        refreshToken: "refresh",
        registrationCompleted: true,
      },
    });

    expect(mockSetAuthToken).toHaveBeenCalledWith("jwt-recruiter");
    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Login realizado com sucesso!",
    );
    expect(mockPush).toHaveBeenCalledWith("/recruiter/dashboard");
  });

  it("redirects incomplete recruiter to recruiter completion page", () => {
    const mutation = useLogin();

    mutation.onSuccess({
      result: {
        accessToken: "jwt-token",
        role: "RECRUITER",
        refreshToken: "refresh-token",
        registrationCompleted: false,
      },
    });

    expect(mockPush).toHaveBeenCalledWith("/signup/role/recruiter");
  });

  it("redirects incomplete candidate to candidate completion page", () => {
    const mutation = useLogin();

    mutation.onSuccess({
      result: {
        accessToken: "jwt-token",
        role: "CANDIDATE",
        registrationCompleted: false,
      },
    });

    expect(mockPush).toHaveBeenCalledWith("/signup/role/candidate");
  });

  it("handles ApiError in onError", () => {
    const mutation = useLogin();

    mutation.onError(new ApiError(401, "Credenciais inválidas", {}));

    expect(mockToastError).toHaveBeenCalledWith("Credenciais inválidas");
  });

  it("handles generic Error in onError", () => {
    const mutation = useLogin();

    mutation.onError(new Error("Erro inesperado"));

    expect(mockToastError).toHaveBeenCalledWith(
      "Ocorreu um erro ao realizar o login.",
    );
  });
});
