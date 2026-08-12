import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";
import { Company } from "@/lib/types/company";

export async function getCompanies(): Promise<Company[]> {
  const response = await httpClient.get<ApiResponse<Company[]>>("/companies");
  return response.result;
}

export function useCompaniesQuery() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => getCompanies(),
  });
}
