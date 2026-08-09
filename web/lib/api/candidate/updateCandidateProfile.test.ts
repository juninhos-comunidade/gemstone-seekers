import { describe, it, expect, vi } from "vitest";
import {
  updateCandidateProfile,
  useUpdateCandidateMutation,
} from "./updateCandidateProfile";

const mockInvalidateQueries = vi.fn();
const mockUseMutation = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
  useMutation: (options: unknown) => mockUseMutation(options),
}));

describe("updateCandidateProfile API", () => {
  it("atualiza perfil do candidato com estado SP", async () => {
    const input = {
      phone: "11999999999",
      summary: "Desenvolvedor experiente",
      name: "João Silva",
      documentType: "CPF" as const,
      documentNumber: "12345678900",
      address: {
        street: "Rua A",
        number: "123",
        neighborhood: "Centro",
        complement: "Apto 1",
        zipCode: "01000-000",
        cityName: "São Paulo",
        stateCode: "SP",
      },
      links: [{ label: "GitHub", url: "https://github.com" }],
      languages: [{ name: "Inglês", level: "Fluente" }],
      experiences: [],
      educations: [],
      certifications: [],
      projects: [],
    };

    const result = await updateCandidateProfile(input);
    expect(result.phone).toBe("11999999999");
    expect(result.user.name).toBe("João Silva");
    expect(result.address?.stateName).toBe("São Paulo");
  });

  it("atualiza perfil do candidato com estado diferente de SP", async () => {
    const input = {
      phone: "21999999999",
      summary: "Desenvolvedor Frontend",
      name: "Maria Santos",
      documentType: "CPF" as const,
      documentNumber: "98765432100",
      address: {
        street: "Rua B",
        number: "456",
        neighborhood: "Copacabana",
        zipCode: "22000-000",
        cityName: "Rio de Janeiro",
        stateCode: "RJ",
      },
    };

    const result = await updateCandidateProfile(input);
    expect(result.address?.stateName).toBe("RJ");
    expect(result.address?.complement).toBe("");
    expect(result.links).toEqual([]);
  });

  it("useUpdateCandidateMutation invalidates candidateProfile query on success", () => {
    mockUseMutation.mockImplementation((options) => {
      if (options && typeof options === "object" && "onSuccess" in options) {
        (options.onSuccess as () => void)();
      }
      return options;
    });

    useUpdateCandidateMutation();
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["candidateProfile"],
    });
  });
});
