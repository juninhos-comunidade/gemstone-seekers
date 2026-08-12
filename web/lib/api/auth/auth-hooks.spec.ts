import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiError } from "@/lib/api/errors";

const mockUseRouter = vi.fn();
const mockUseMutation = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockSetAuthToken = vi.fn();
const mockHttpPost = vi.fn();
const mockHttpPatch = vi.fn();

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
    patch: (...args: unknown[]) => mockHttpPatch(...args),
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
      result: {
        token: "jwt-token",
        role: "CANDIDATE",
        registrationCompleted: true,
      },
    });

    expect(mockSetAuthToken).toHaveBeenCalledWith("jwt-token");
    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Login realizado com sucesso!",
    );
    expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
  });

  it("useLogin redirects incomplete recruiter registrations to the completion page", async () => {
    const { useLogin } = await import("./login");
    const mutation = useLogin();

    mutation.onSuccess({
      success: true,
      result: {
        token: "jwt-token",
        role: "RECRUITER",
        registrationCompleted: false,
      },
    });

    expect(mockPush).toHaveBeenCalledWith("/signup/role/recruiter");
  });

  it("useLogin redirects incomplete candidate registrations to the completion page", async () => {
    const { useLogin } = await import("./login");
    const mutation = useLogin();

    mutation.onSuccess({
      success: true,
      result: {
        token: "jwt-token",
        role: "CANDIDATE",
        registrationCompleted: false,
      },
    });

    expect(mockSetAuthToken).toHaveBeenCalledWith("jwt-token");
    expect(mockPush).toHaveBeenCalledWith("/signup/role/candidate");
  });

  it("useLogin uses accessToken fallback and redirects recruiters to dashboard", async () => {
    const { useLogin } = await import("./login");
    const mutation = useLogin();

    mutation.onSuccess({
      success: true,
      accessToken: "access-token",
      result: {
        role: "RECRUITER",
        registrationCompleted: true,
      },
    });

    expect(mockSetAuthToken).toHaveBeenCalledWith("access-token");
    expect(mockPush).toHaveBeenCalledWith("/recruiter/dashboard");
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

    expect(mockHttpPost).toHaveBeenCalledWith("/auth/register", {
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

  it("useSignup uses nested accessToken fallback when token fields are absent", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    mutation.onSuccess({
      success: true,
      result: {
        accessToken: "nested-access-token",
      },
    });

    expect(mockSetAuthToken).toHaveBeenCalledWith("nested-access-token");
    expect(mockPush).toHaveBeenCalledWith("/signup/role");
  });

  it("useUpdateCandidate posts profile data and redirects on success", async () => {
    const { useUpdateCandidate } = await import("./UpdateCandidate");
    const mutation = useUpdateCandidate();

    await mutation.mutationFn({
      documentType: "CPF",
      documentNumber: "123.456.789-00",
      phone: "(11) 99999-9999",
      area: "Tecnologia",
      role: "Frontend",
      experience: "Júnior",
      location: "São Paulo",
      resume: "https://linkedin.com/in/teste",
    });

    expect(mockHttpPatch).toHaveBeenCalledWith("/auth/complete-registration", {
      role: "CANDIDATE",
      documentType: "CPF",
      documentNumber: "123.456.789-00",
      phone: "(11) 99999-9999",
      summary: "Frontend • Tecnologia • Júnior • São Paulo",
    });

    mutation.onSuccess();

    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Perfil do candidato atualizado com sucesso!",
    );
    expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
  });

  it("useUpdateCandidate redirects when registration is already completed", async () => {
    const { useUpdateCandidate } = await import("./UpdateCandidate");
    const mutation = useUpdateCandidate();

    mutation.onError(
      new ApiError(409, "Registration already completed", {
        message: "Registration already completed",
      }),
    );

    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Cadastro do candidato já estava concluído.",
    );
    expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
  });

  it("useUpdateRecruiter posts profile data and redirects on success", async () => {
    const { useUpdateRecruiter } = await import("./UpdateRecruiter");
    const mutation = useUpdateRecruiter();

    await mutation.mutationFn({
      documentType: "CNPJ",
      documentNumber: "00.000.000/0000-00",
      companyName: "Gemstone Seekers",
      jobTitle: "Analista de RH",
      phone: "(11) 99999-9999",
      companyWebsite: "https://gemstoneseekers.com",
      companySize: "11-50",
    });

    expect(mockHttpPatch).toHaveBeenCalledWith("/auth/complete-registration", {
      role: "RECRUITER",
      documentType: "CNPJ",
      documentNumber: "00.000.000/0000-00",
      phone: "(11) 99999-9999",
      department: "Analista de RH",
    });

    mutation.onSuccess();

    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Perfil do recrutador atualizado com sucesso!",
    );
    expect(mockPush).toHaveBeenCalledWith("/recruiter/dashboard");
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

    expect(mockHttpPatch).toHaveBeenCalledWith("/auth/complete-registration", {
      role: "RECRUITER",
      phone: "(11) 99999-9999",
      department: "Analista de RH",
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

  it("useUpdateCandidate shows generic error fallback when message is unavailable", async () => {
    const { useUpdateCandidate } = await import("./UpdateCandidate");
    const mutation = useUpdateCandidate();

    mutation.onError({} as Error);

    expect(mockToastError).toHaveBeenCalledWith(
      "Erro ao atualizar perfil do candidato",
    );
  });

  it("useUpdateRecruiter shows generic error fallback when message is unavailable", async () => {
    const { useUpdateRecruiter } = await import("./UpdateRecruiter");
    const mutation = useUpdateRecruiter();

    mutation.onError({} as Error);

    expect(mockToastError).toHaveBeenCalledWith(
      "Erro ao atualizar perfil do recrutador",
    );
  });

  it("useUpdateRecruiter redirects when registration is already completed", async () => {
    const { useUpdateRecruiter } = await import("./UpdateRecruiter");
    const mutation = useUpdateRecruiter();

    mutation.onError(
      new ApiError(409, "Registration already completed", {
        message: "Registration already completed",
      }),
    );

    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Cadastro do recrutador já estava concluído.",
    );
    expect(mockPush).toHaveBeenCalledWith("/recruiter/dashboard");
  });

  it("useLogin onError handles timeout and calls onErrorMessage", async () => {
    const { useLogin } = await import("./login");
    const mockOnErrorMessage = vi.fn();
    const mutation = useLogin({ onErrorMessage: mockOnErrorMessage });

    mutation.onError(new Error("timeout occurred"));

    expect(mockToastError).toHaveBeenCalledWith(
      "O servidor está iniciando, isso pode levar até 1 minuto. Tente novamente.",
    );
    expect(mockOnErrorMessage).toHaveBeenCalledWith(
      "O servidor está iniciando, isso pode levar até 1 minuto. Tente novamente.",
    );
  });

  it("useLogin onError handles generic errors and forwards message", async () => {
    const { useLogin } = await import("./login");
    const mockOnErrorMessage = vi.fn();
    const mutation = useLogin({ onErrorMessage: mockOnErrorMessage });

    mutation.onError(new Error("something went wrong"));

    expect(mockToastError).toHaveBeenCalledWith("something went wrong");
    expect(mockOnErrorMessage).toHaveBeenCalledWith("something went wrong");
  });

  it("useLogin retry logic retries only on timeout/network once", async () => {
    const { useLogin } = await import("./login");
    const mutation = useLogin();

    // retry should return true for first timeout/network error
    expect(mutation.retry?.(0, new Error("timeout"))).toBe(true);
    // but not after one failure
    expect(mutation.retry?.(1, new Error("timeout"))).toBe(false);
    // non-network errors should not retry
    expect(mutation.retry?.(0, new Error("other"))).toBe(false);
  });

  it("useLogin onSuccess handles failure and missing token cases", async () => {
    const { useLogin } = await import("./login");
    const mutation = useLogin();

    // success === false should show message
    mutation.onSuccess({ success: false, message: "Invalid credentials" });
    expect(mockToastError).toHaveBeenCalledWith("Invalid credentials");

    // success true but no token should show fallback error
    mutation.onSuccess({ success: true });
    expect(mockToastError).toHaveBeenCalledWith(
      "Não foi possível autenticar. Tente novamente.",
    );
  });
});
