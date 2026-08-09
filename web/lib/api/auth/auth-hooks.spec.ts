import { describe, it, expect, vi, beforeEach } from "vitest";

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

describe("auth api hooks", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseMutation.mockImplementation((options) => options);
  });

  it("useLogin configures mutation, stores token and redirects on success", async () => {
    const { useLogin } = await import("./login");
    const mutation = useLogin();

    await mutation.mutationFn({
      email: "user@example.com",
      password: "123456",
    });

    expect(mockHttpPost).toHaveBeenCalledWith("/auth/login", {
      email: "user@example.com",
      password: "123456",
    });

    mutation.onSuccess({
      success: true,
      result: { token: "jwt-token" },
    });

    expect(mockSetAuthToken).toHaveBeenCalledWith("jwt-token");
    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Login realizado com sucesso!",
    );
    expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
  });

  it("useSignup maps payload, stores token and redirects on success", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    await mutation.mutationFn({
      fullName: "João Pedro",
      email: "joao@example.com",
      password: "abc123",
      confirmPassword: "abc123",
    });

    expect(mockHttpPost).toHaveBeenCalledWith("auth/register", {
      name: "João Pedro",
      email: "joao@example.com",
      password: "abc123",
    });

    mutation.onSuccess({
      success: true,
      token: "signup-token",
    });

    expect(mockSetAuthToken).toHaveBeenCalledWith("signup-token");
    expect(mockToastSuccess).toHaveBeenCalledWith("Conta criada com sucesso!");
    expect(mockPush).toHaveBeenCalledWith("/signup/role");
  });

  it("useUpdateCandidate posts profile data and redirects on success", async () => {
    const { useUpdateCandidate } = await import("./UpdateCandidate");
    const mutation = useUpdateCandidate();

    await mutation.mutationFn({
      phone: "(11) 99999-9999",
      area: "Tecnologia",
      role: "Frontend",
      experience: "Júnior",
      location: "São Paulo",
      resume: "https://linkedin.com/in/teste",
    });

    expect(mockHttpPost).toHaveBeenCalledWith("/candidate/profile", {
      phone: "(11) 99999-9999",
      area: "Tecnologia",
      role: "Frontend",
      experience: "Júnior",
      location: "São Paulo",
      resume: "https://linkedin.com/in/teste",
    });

    mutation.onSuccess();

    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Perfil do candidato atualizado com sucesso!",
    );
    expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
  });

  it("useUpdateRecruiter posts profile data and shows error fallback", async () => {
    const { useUpdateRecruiter } = await import("./UpdateRecruiter");
    const mutation = useUpdateRecruiter();

    await mutation.mutationFn({
      companyName: "Gemstone Seekers",
      jobTitle: "Analista de RH",
      phone: "(11) 99999-9999",
      companyWebsite: "https://gemstoneseekers.com",
      companySize: "11-50",
    });

    expect(mockHttpPost).toHaveBeenCalledWith("/recruiter/profile", {
      companyName: "Gemstone Seekers",
      jobTitle: "Analista de RH",
      phone: "(11) 99999-9999",
      companyWebsite: "https://gemstoneseekers.com",
      companySize: "11-50",
    });

    mutation.onSuccess();
    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Perfil do recrutador atualizado com sucesso!",
    );
    expect(mockPush).toHaveBeenCalledWith("/recruiter/dashboard");

    mutation.onError(new Error("falhou"));
    expect(mockToastError).toHaveBeenCalledWith("falhou");

    mockToastError.mockClear();
    const errorWithoutMsg = {} as Error;
    mutation.onError(errorWithoutMsg);
    expect(mockToastError).toHaveBeenCalledWith(
      "Erro ao atualizar perfil do recrutador",
    );
  });

  it("useLogin handles token fallbacks and onError branch without message", async () => {
    const { useLogin } = await import("./login");
    const mutation = useLogin();

    mutation.onSuccess({ success: true, token: "token-direct" });
    expect(mockSetAuthToken).toHaveBeenCalledWith("token-direct");

    mutation.onSuccess({ success: true, accessToken: "token-access" });
    expect(mockSetAuthToken).toHaveBeenCalledWith("token-access");

    mutation.onSuccess({
      success: true,
      result: { accessToken: "token-result-access" },
    });
    expect(mockSetAuthToken).toHaveBeenCalledWith("token-result-access");

    mutation.onSuccess({ success: false });

    const errNoMsg = {} as Error;
    mutation.onError(errNoMsg);
    expect(mockToastError).toHaveBeenCalledWith("Erro ao fazer login");
  });

  it("useSignup handles token fallbacks and onError branch without message", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    mutation.onSuccess({ success: true, accessToken: "token-access-signup" });
    expect(mockSetAuthToken).toHaveBeenCalledWith("token-access-signup");

    mutation.onSuccess({
      success: true,
      result: { token: "token-res-signup" },
    });
    expect(mockSetAuthToken).toHaveBeenCalledWith("token-res-signup");

    mutation.onSuccess({
      success: true,
      result: { accessToken: "token-res-acc-signup" },
    });
    expect(mockSetAuthToken).toHaveBeenCalledWith("token-res-acc-signup");

    mutation.onSuccess({ success: false });

    mutation.onError(new Error("Erro de cadastro"));
    expect(mockToastError).toHaveBeenCalledWith("Erro de cadastro");

    mockToastError.mockClear();
    const errNoMsg = {} as Error;
    mutation.onError(errNoMsg);
    expect(mockToastError).toHaveBeenCalledWith("Falha ao cadastrar");
  });

  it("useUpdateCandidate handles onError fallback without message", async () => {
    const { useUpdateCandidate } = await import("./UpdateCandidate");
    const mutation = useUpdateCandidate();

    const errNoMsg = {} as Error;
    mutation.onError(errNoMsg);
    expect(mockToastError).toHaveBeenCalledWith(
      "Erro ao atualizar perfil do candidato",
    );
  });
});
