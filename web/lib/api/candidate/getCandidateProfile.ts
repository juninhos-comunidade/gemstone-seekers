import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";
import { CandidateProfileResponse } from "@/lib/types/candidate";
import { ApiResponse } from "@/lib/types/api/response";

export async function getCandidateProfile(): Promise<CandidateProfileResponse | null> {
  const response =
    await httpClient.get<ApiResponse<CandidateProfileResponse>>("/profile");
  return response?.result ?? null;
}

export function useCandidateQuery() {
  return useQuery({
    queryKey: ["candidateProfile"],
    queryFn: () => getCandidateProfile(),
  });
}
