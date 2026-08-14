import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";

export type TechnologyDemandResponse = {
  technologyId: number;
  technologyName: string;
  technologyCategory: string;
  jobCount: number;
  mandatoryCount: number;
};

async function getTechnologyDemand() {
  return httpClient.get<ApiResponse<TechnologyDemandResponse[]>>(
    "/market-radar/technology-demand",
  );
}

export function useTechnologyDemand() {
  return useQuery({
    queryKey: ["market-radar", "technology-demand"],
    queryFn: getTechnologyDemand,
  });
}
