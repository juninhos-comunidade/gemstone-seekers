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

  it("useLogin handles onError with error message and fallback", async () => {
    const { useLogin } = await import("./login");
    const mutation = useLogin();

    mutation.onError(new Error("Erro de autenticação"));
    expect(mockToastError).toHaveBeenCalledWith("Erro de autenticação");

    mutation.onError({ message: undefined } as unknown as Error);
    expect(mockToastError).toHaveBeenCalledWith("Erro ao fazer login");
  });

  it("useSignup handles onError with error message and fallback", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    mutation.onError(new Error("Email em uso"));
    expect(mockToastError).toHaveBeenCalledWith("Email em uso");

    mutation.onError({ message: undefined } as unknown as Error);
    expect(mockToastError).toHaveBeenCalledWith("Falha ao cadastrar");
  });

  it("useUpdateCandidate handles onError with error message and fallback", async () => {
    const { useUpdateCandidate } = await import("./UpdateCandidate");
    const mutation = useUpdateCandidate();

    mutation.onError(new Error("Erro candidato"));
    expect(mockToastError).toHaveBeenCalledWith("Erro candidato");

    mutation.onError({ message: undefined } as unknown as Error);
    expect(mockToastError).toHaveBeenCalledWith(
      "Erro ao atualizar perfil do candidato",
    );
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

    mutation.onError({ message: undefined } as unknown as Error);
    expect(mockToastError).toHaveBeenCalledWith(
      "Erro ao atualizar perfil do recrutador",
    );
  });
});
