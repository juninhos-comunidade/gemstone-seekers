import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSignup } from "./signup";

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

describe("useSignup", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseMutation.mockImplementation((options) => options);
  });

  it("configures mutation and executes signup request", async () => {
    const mutation = useSignup();
    mockHttpPost.mockResolvedValueOnce({ success: true });

    await mutation.mutationFn({
      fullName: "João Silva",
      email: "joao@example.com",
      password: "pass",
      confirmPassword: "pass",
    });

    expect(mockHttpPost).toHaveBeenCalledWith("/auth/register", {
      name: "João Silva",
      email: "joao@example.com",
      password: "pass",
    });
  });

  it("handles onSuccess with token in result.accessToken", () => {
    const mutation = useSignup();

    mutation.onSuccess({
      success: true,
      result: {
        accessToken: "nested-token",
      },
    });

    expect(mockSetAuthToken).toHaveBeenCalledWith("nested-token");
    expect(mockToastSuccess).toHaveBeenCalledWith("Conta criada com sucesso!");
    expect(mockPush).toHaveBeenCalledWith("/signup/role");
  });

  it("handles onSuccess with top-level accessToken", () => {
    const mutation = useSignup();

    mutation.onSuccess({
      success: true,
      accessToken: "top-accessToken",
    });

    expect(mockSetAuthToken).toHaveBeenCalledWith("top-accessToken");
    expect(mockToastSuccess).toHaveBeenCalledWith("Conta criada com sucesso!");
    expect(mockPush).toHaveBeenCalledWith("/signup/role");
  });

  it("handles onSuccess with top-level token", () => {
    const mutation = useSignup();

    mutation.onSuccess({
      success: true,
      token: "top-token",
    });

    expect(mockSetAuthToken).toHaveBeenCalledWith("top-token");
    expect(mockToastSuccess).toHaveBeenCalledWith("Conta criada com sucesso!");
    expect(mockPush).toHaveBeenCalledWith("/signup/role");
  });

  it("handles onSuccess when no token is provided", () => {
    const mutation = useSignup();

    mutation.onSuccess({
      success: true,
    });

    expect(mockSetAuthToken).not.toHaveBeenCalled();
    expect(mockToastSuccess).toHaveBeenCalledWith("Conta criada com sucesso!");
    expect(mockPush).toHaveBeenCalledWith("/signup/role");
  });

  it("handles onError with custom error message", () => {
    const mutation = useSignup();

    mutation.onError(new Error("Email já cadastrado"));

    expect(mockToastError).toHaveBeenCalledWith("Email já cadastrado");
  });

  it("handles onError with fallback error message when message is missing", () => {
    const mutation = useSignup();

    mutation.onError({} as Error);

    expect(mockToastError).toHaveBeenCalledWith("Falha ao cadastrar");
  });
});
