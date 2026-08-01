import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CandidateProfile, UpdateCandidateInput } from "@/lib/types/candidate";
import { INITIAL_MOCK_CANDIDATE } from "@/lib/mocks/candidateMock";

export async function updateCandidateProfile(
  input: UpdateCandidateInput,
): Promise<CandidateProfile> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  return {
    ...INITIAL_MOCK_CANDIDATE,
    phone: input.phone,
    summary: input.summary,
    user: {
      ...INITIAL_MOCK_CANDIDATE.user,
      name: input.name,
      documentType: input.documentType,
      documentNumber: input.documentNumber,
    },
    address: {
      id: INITIAL_MOCK_CANDIDATE.address?.id || "addr-new",
      street: input.address.street,
      number: input.address.number,
      neighborhood: input.address.neighborhood,
      complement: input.address.complement || "",
      zipCode: input.address.zipCode,
      cityName: input.address.cityName,
      stateName:
        input.address.stateCode === "SP"
          ? "São Paulo"
          : input.address.stateCode,
      stateCode: input.address.stateCode,
      countryName: "Brasil",
    },
    links: input.links || [],
    languages: input.languages || [],
    experiences: input.experiences || [],
    educations: input.educations || [],
    certifications: input.certifications || [],
    projects: input.projects || [],
    updatedAt: new Date().toISOString(),
  };
}

export function useUpdateCandidateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCandidateInput) => updateCandidateProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
    },
  });
}
