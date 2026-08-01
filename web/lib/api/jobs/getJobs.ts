import { useQuery } from "@tanstack/react-query";
import { Job } from "@/lib/types/job";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";

export async function getJobs(): Promise<Job[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return MOCK_JOBS;
}

export function useJobsQuery() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => getJobs(),
  });
}
