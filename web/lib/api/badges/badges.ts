import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";
import { CandidateBadgeResponse } from "@/lib/types/badge";
import { ApiResponse } from "@/lib/types/api/response";

export async function getCandidateBadges(): Promise<CandidateBadgeResponse[]> {
  const response =
    await httpClient.get<ApiResponse<CandidateBadgeResponse[]>>("/badges/me");
  return response?.result ?? [];
}

export function useCandidateBadgesQuery() {
  return useQuery({
    queryKey: ["candidateBadges"],
    queryFn: () => getCandidateBadges(),
  });
}
