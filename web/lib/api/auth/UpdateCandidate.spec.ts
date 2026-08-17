import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUpdateCandidate } from "./UpdateCandidate";

const mockUseRouter = vi.fn();
const mockUseMutation = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockHttpPatch = vi.fn();
const mockSetUserRole = vi.fn();

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
  setUserRole: (...args: unknown[]) => mockSetUserRole(...args),
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

  it("handles onSuccess by setting user role, showing toast and redirecting", () => {
    const mutation = useUpdateCandidate();

    mutation.onSuccess();

    expect(mockSetUserRole).toHaveBeenCalledWith("CANDIDATE");
    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Perfil do candidato atualizado com sucesso!",
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
