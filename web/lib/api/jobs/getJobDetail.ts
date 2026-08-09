import { useQuery } from "@tanstack/react-query";
import { Job } from "@/lib/types/job";
import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";

export async function getJobDetail(id: string): Promise<Job | null> {
  try {
    const response = await httpClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return response.result ?? null;
  } catch {
    return null;
  }
}

export function useJobDetailQuery(id: string) {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: () => getJobDetail(id),
    enabled: Boolean(id),
  });
}
