import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUpdateRecruiter } from "./UpdateRecruiter";

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

describe("useUpdateRecruiter", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseMutation.mockImplementation((options) => options);
  });

  it("configures mutation and executes patch request", async () => {
    const mutation = useUpdateRecruiter();
    mockHttpPatch.mockResolvedValueOnce({ success: true });

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
  });

  it("handles onSuccess by setting user role, showing toast and redirecting", () => {
    const mutation = useUpdateRecruiter();

    mutation.onSuccess();

    expect(mockSetUserRole).toHaveBeenCalledWith("RECRUITER");
    expect(mockToastSuccess).toHaveBeenCalledWith(
      "Perfil do recrutador atualizado com sucesso!",
    );
    expect(mockPush).toHaveBeenCalledWith("/recruiter/dashboard");
  });

  it("handles onError with custom error message", () => {
    const mutation = useUpdateRecruiter();

    mutation.onError(new Error("Falha na conexão"));

    expect(mockToastError).toHaveBeenCalledWith("Falha na conexão");
  });

  it("handles onError with fallback error message when message is missing", () => {
    const mutation = useUpdateRecruiter();

    mutation.onError({} as Error);

    expect(mockToastError).toHaveBeenCalledWith(
      "Erro ao atualizar perfil do recrutador",
    );
  });
});
