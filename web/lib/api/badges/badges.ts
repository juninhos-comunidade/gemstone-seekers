import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";
import { CandidateBadgeResponse } from "@/lib/types/badge";
import { ApiResponse } from "@/lib/types/api/response";
import { MOCK_CANDIDATE_BADGES } from "@/lib/mocks/badgeMock";

export async function getCandidateBadges(): Promise<CandidateBadgeResponse[]> {
  try {
    const response = await httpClient.get<
      ApiResponse<CandidateBadgeResponse[]>
    >("/candidates/me/badges");
    return response?.result ?? [];
  } catch {
    return MOCK_CANDIDATE_BADGES;
  }
}

export function useCandidateBadgesQuery() {
  return useQuery({
    queryKey: ["candidateBadges"],
    queryFn: () => getCandidateBadges(),
  });
}
