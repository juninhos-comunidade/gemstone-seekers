import { useQuery } from "@tanstack/react-query";
import { CandidateProfile } from "@/lib/types/candidate";
import { INITIAL_MOCK_CANDIDATE } from "@/lib/mocks/candidateMock";

export async function getCandidateProfile(): Promise<CandidateProfile | null> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return INITIAL_MOCK_CANDIDATE;
}

export function useCandidateQuery() {
  return useQuery({
    queryKey: ["candidateProfile"],
    queryFn: () => getCandidateProfile(),
  });
}
