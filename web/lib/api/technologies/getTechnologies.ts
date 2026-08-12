import { useQuery } from "@tanstack/react-query";
import { TechnologyItem } from "@/lib/types/technology";
import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";

export async function getTechnologies(): Promise<TechnologyItem[]> {
  const response =
    await httpClient.get<ApiResponse<TechnologyItem[]>>("/technologies");
  return response.result;
}

export function useTechnologiesQuery() {
  return useQuery({
    queryKey: ["technologies"],
    queryFn: () => getTechnologies(),
  });
}
