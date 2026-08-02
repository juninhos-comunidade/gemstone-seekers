import { useQuery } from "@tanstack/react-query";
import { Job } from "@/lib/types/job";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";

export async function getJobDetail(id: string): Promise<Job | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const found = MOCK_JOBS.find((j) => j.id === id);
  return found || null;
}

export function useJobDetailQuery(id: string) {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: () => getJobDetail(id),
    enabled: Boolean(id),
  });
}
