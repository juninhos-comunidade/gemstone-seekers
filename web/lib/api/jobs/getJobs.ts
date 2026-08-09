import { useQuery } from "@tanstack/react-query";
import { Job } from "@/lib/types/job";
import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";

export async function getJobs(): Promise<Job[]> {
  const response = await httpClient.get<ApiResponse<Job[]>>("/jobs");
  return response.result;
}

export function useJobsQuery() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => getJobs(),
  });
}
