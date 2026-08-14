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
    mockUseMutation.mockImplementation((options) => ({
      ...options,
      mutate: vi.fn((data) => options.mutationFn?.(data)),
      mutateAsync: vi.fn((data) => options.mutationFn?.(data)),
      data: undefined,
      error: null,
      isPending: false,
      isSuccess: false,
      isError: false,
      isIdle: true,
      status: "idle",
      reset: vi.fn(),
    }));
  });

  it("useLogin configures mutation, stores token and redirects on success", async () => {
    const { useLogin } = await import("./login");
    const mutation = useLogin();

    await mutation.mutateAsync({
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

    expect(mockPush).toHaveBeenCalledWith("/role/recruiter");
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
    expect(mockPush).toHaveBeenCalledWith("/role/candidate");
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

    await mutation.mutateAsync({
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
    expect(mockPush).toHaveBeenCalledWith("/role");
  });

  it("signupRequest performs auto-login when /auth/register returns no token", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    mockHttpPost
      .mockResolvedValueOnce({ success: true, message: "User registered" })
      .mockResolvedValueOnce({
        success: true,
        result: { token: "auto-login-token" },
      });

    const result = await mutation.mutateAsync({
      fullName: "João Pedro",
      email: "joao@example.com",
      password: "abc123",
      confirmPassword: "abc123",
    });

    expect(mockHttpPost).toHaveBeenNthCalledWith(1, "/auth/register", {
      name: "João Pedro",
      email: "joao@example.com",
      password: "abc123",
    });
    expect(mockHttpPost).toHaveBeenNthCalledWith(2, "/auth/login", {
      email: "joao@example.com",
      password: "abc123",
    });
    expect(result.token).toBe("auto-login-token");
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
    expect(mockPush).toHaveBeenCalledWith("/role");
  });

  it("useSignup redirects to login when token is missing in response", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    mutation.onSuccess({
      success: true,
    });

    expect(mockToastError).toHaveBeenCalledWith(
      "Conta criada, mas não foi possível autenticar automaticamente. Faça login.",
    );
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("useUpdateCandidate posts profile data and redirects on success", async () => {
    const { useUpdateCandidate } = await import("./UpdateCandidate");
    const mutation = useUpdateCandidate();

    await mutation.mutateAsync({
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
      "Cadastro do candidato já estava concluído ou dados já cadastrados.",
    );
    expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
  });

  it("useUpdateRecruiter posts profile data and redirects on success", async () => {
    const { useUpdateRecruiter } = await import("./UpdateRecruiter");
    const mutation = useUpdateRecruiter();

    await mutation.mutateAsync({
      documentType: "CNPJ",
      documentNumber: "00.000.000/0000-00",
      companyId: "company-uuid-123",
      jobTitle: "Analista de RH",
      phone: "(11) 99999-9999",
    });

    expect(mockHttpPatch).toHaveBeenCalledWith("/auth/complete-registration", {
      role: "RECRUITER",
      documentType: "CNPJ",
      documentNumber: "00.000.000/0000-00",
      phone: "(11) 99999-9999",
      department: "Analista de RH",
      companyId: "company-uuid-123",
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

    await mutation.mutateAsync({
      companyId: "company-uuid-123",
      jobTitle: "Analista de RH",
      phone: "(11) 99999-9999",
    });

    expect(mockHttpPatch).toHaveBeenCalledWith("/auth/complete-registration", {
      role: "RECRUITER",
      phone: "(11) 99999-9999",
      department: "Analista de RH",
      companyId: "company-uuid-123",
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
      "Cadastro do recrutador já estava concluído ou dados já cadastrados.",
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

  it("useLogin retry logic retries on timeout/network up to 2 times", async () => {
    const { useLogin } = await import("./login");
    const mutation = useLogin();

    expect(mutation.retry?.(0, new Error("timeout"))).toBe(true);
    expect(mutation.retry?.(1, new Error("network failure"))).toBe(true);
    expect(mutation.retry?.(2, new Error("timeout"))).toBe(false);
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

  // ─── useSignup – onError ───────────────────────────────────────────────────

  it("useSignup onError handles timeout and calls onErrorMessage", async () => {
    const { useSignup } = await import("./signup");
    const mockOnErrorMessage = vi.fn();
    const mutation = useSignup({ onErrorMessage: mockOnErrorMessage });

    mutation.onError(new Error("network error"));

    const expected =
      "O servidor está iniciando, isso pode levar até 1 minuto. Tente novamente.";
    expect(mockToastError).toHaveBeenCalledWith(expected);
    expect(mockOnErrorMessage).toHaveBeenCalledWith(expected);
  });

  it("useSignup onError handles timeout without onErrorMessage option", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    mutation.onError(new Error("econnaborted"));

    expect(mockToastError).toHaveBeenCalledWith(
      "O servidor está iniciando, isso pode levar até 1 minuto. Tente novamente.",
    );
  });

  it("useSignup onError handles generic errors and forwards message", async () => {
    const { useSignup } = await import("./signup");
    const mockOnErrorMessage = vi.fn();
    const mutation = useSignup({ onErrorMessage: mockOnErrorMessage });

    mutation.onError(new Error("something went wrong"));

    expect(mockToastError).toHaveBeenCalledWith("something went wrong");
    expect(mockOnErrorMessage).toHaveBeenCalledWith("something went wrong");
  });

  it("useSignup onError uses fallback message when error has no message", async () => {
    const { useSignup } = await import("./signup");
    const mockOnErrorMessage = vi.fn();
    const mutation = useSignup({ onErrorMessage: mockOnErrorMessage });

    mutation.onError({} as Error);

    expect(mockToastError).toHaveBeenCalledWith("Falha ao cadastrar");
    expect(mockOnErrorMessage).toHaveBeenCalledWith("Falha ao cadastrar");
  });

  // ─── useSignup – retry ────────────────────────────────────────────────────

  it("useSignup retry logic retries on timeout/network up to 2 times", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    expect(mutation.retry?.(0, new Error("timeout"))).toBe(true);
    expect(mutation.retry?.(1, new Error("network failure"))).toBe(true);
    // third failure (failureCount === 2) should not retry
    expect(mutation.retry?.(2, new Error("timeout"))).toBe(false);
    // non-network errors should never retry
    expect(mutation.retry?.(0, new Error("bad request"))).toBe(false);
  });

  // ─── useSignup – onSuccess token fallbacks ────────────────────────────────

  it("useSignup onSuccess uses root accessToken fallback", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    mutation.onSuccess({ success: true, accessToken: "root-access-token" });

    expect(mockSetAuthToken).toHaveBeenCalledWith("root-access-token");
    expect(mockPush).toHaveBeenCalledWith("/role");
  });

  it("useSignup onSuccess shows toast error when success is false", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    mutation.onSuccess({ success: false, message: "Email já cadastrado" });

    expect(mockToastError).toHaveBeenCalledWith("Email já cadastrado");
    expect(mockSetAuthToken).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("useSignup onSuccess uses default message when success is false and message is absent", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    mutation.onSuccess({ success: false });

    expect(mockToastError).toHaveBeenCalledWith("Falha ao cadastrar");
  });

  // ─── signupRequest – auto-login token variant fallbacks ───────────────────

  it("signupRequest auto-login uses data.token fallback", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    mockHttpPost
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ success: true, data: { token: "data-token" } });

    const result = await mutation.mutateAsync({
      fullName: "Ana Silva",
      email: "ana@example.com",
      password: "pass",
      confirmPassword: "pass",
    });

    expect(result.token).toBe("data-token");
  });

  it("signupRequest auto-login uses data.accessToken fallback", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    mockHttpPost
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({
        success: true,
        data: { accessToken: "data-access-token" },
      });

    const result = await mutation.mutateAsync({
      fullName: "Ana Silva",
      email: "ana@example.com",
      password: "pass",
      confirmPassword: "pass",
    });

    expect(result.token).toBe("data-access-token");
  });

  it("signupRequest auto-login uses jwt fallback", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    mockHttpPost
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ success: true, jwt: "jwt-value" });

    const result = await mutation.mutateAsync({
      fullName: "Ana Silva",
      email: "ana@example.com",
      password: "pass",
      confirmPassword: "pass",
    });

    expect(result.token).toBe("jwt-value");
  });

  it("signupRequest returns original response when auto-login throws", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    const originalResponse = { success: true, message: "User registered" };
    mockHttpPost
      .mockResolvedValueOnce(originalResponse)
      .mockRejectedValueOnce(new Error("login failed"));

    const result = await mutation.mutateAsync({
      fullName: "Ana Silva",
      email: "ana@example.com",
      password: "pass",
      confirmPassword: "pass",
    });

    // auto-login threw → original response returned unchanged
    expect(result).toEqual(originalResponse);
    expect(result.token).toBeUndefined();
  });

  it("signupRequest skips auto-login when register returns success===false", async () => {
    const { useSignup } = await import("./signup");
    const mutation = useSignup();

    const failResponse = { success: false, message: "Email já usado" };
    mockHttpPost.mockResolvedValueOnce(failResponse);

    const result = await mutation.mutateAsync({
      fullName: "Ana Silva",
      email: "ana@example.com",
      password: "pass",
      confirmPassword: "pass",
    });

    // only one call to httpClient.post (no auto-login attempt)
    expect(mockHttpPost).toHaveBeenCalledTimes(1);
    expect(result).toEqual(failResponse);
  });
});
