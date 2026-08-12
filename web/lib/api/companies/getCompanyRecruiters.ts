import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";
import { CompanyRecruiter } from "@/lib/types/company";

export async function getCompanyRecruiters(
  companyId: string,
): Promise<CompanyRecruiter[]> {
  if (!companyId) return [];
  const response = await httpClient.get<ApiResponse<CompanyRecruiter[]>>(
    `/companies/${companyId}/recruiters`,
  );
  return response.result;
}

export function useCompanyRecruitersQuery(companyId: string) {
  return useQuery({
    queryKey: ["companies", companyId, "recruiters"],
    queryFn: () => getCompanyRecruiters(companyId),
    enabled: Boolean(companyId),
  });
}
