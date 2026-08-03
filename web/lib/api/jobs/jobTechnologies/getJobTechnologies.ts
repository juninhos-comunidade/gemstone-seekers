import { useQuery } from "@tanstack/react-query";
import { JobTechnology, JobTechnologyApiResponse } from "@/lib/types/job";
import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";

export async function getJobTechnologies(
  jobId: string,
): Promise<JobTechnology[]> {
  if (!jobId) return [];
  const response = await httpClient.get<
    ApiResponse<JobTechnologyApiResponse[]>
  >(`/jobs/${jobId}/technologies`);

  return (response.result || []).map(
    (t) =>
      ({
        technologyId: t.technologyId,
        technologyName: t.technologyName,
        category: t.category,
        isMandatory: t.isMandatory,
      }) as JobTechnology,
  );
}

export function useJobTechnologiesQuery(jobId: string) {
  return useQuery({
    queryKey: ["jobs", jobId, "technologies"],
    queryFn: () => getJobTechnologies(jobId),
    enabled: Boolean(jobId),
  });
}
