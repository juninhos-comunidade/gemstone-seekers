import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { useUpdateCandidate } from "./UpdateCandidate";

const mockUseRouter = vi.fn();
const mockUseMutation = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
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

vi.mock("@/lib/api/client", () => ({
  httpClient: {
    patch: (...args: unknown[]) => mockHttpPatch(...args),
  },
}));

describe("useUpdateCandidate", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseMutation.mockImplementation((options) => options);
  });

  it("configures mutation and executes patch request", async () => {
    const mutation = useUpdateCandidate();
    mockHttpPatch.mockResolvedValueOnce({ success: true });

    await mutation.mutationFn({
      phone: "(11) 99999-9999",
      area: "Tecnologia",
      role: "Frontend",
      experience: "Júnior",
      location: "São Paulo",
      resume: "https://linkedin.com/in/teste",
    });

    expect(mockHttpPatch).toHaveBeenCalledWith("/auth/complete-registration", {
      role: "CANDIDATE",
      phone: "(11) 99999-9999",
      summary: "Frontend • Tecnologia • Júnior • São Paulo",
    });
  });

  it("handles onSuccess by showing toast and redirecting", () => {
    const mutation = useUpdateCandidate();

    mutation.onSuccess();

    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Perfil do candidato atualizado com sucesso!",
    );
    expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
  });

  it("handles 409 ApiError when registration is already completed", () => {
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

  it("handles onError with custom error message", () => {
    const mutation = useUpdateCandidate();

    mutation.onError(new Error("Falha na conexão"));

    expect(mockToastError).toHaveBeenCalledWith("Falha na conexão");
  });

  it("handles onError with fallback error message when message is missing", () => {
    const mutation = useUpdateCandidate();

    mutation.onError({} as Error);

    expect(mockToastError).toHaveBeenCalledWith(
      "Erro ao atualizar perfil do candidato",
    );
  });
});
