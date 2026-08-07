import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";

export type JobStatus = "OPEN" | "CLOSED" | "CANCELLED";

export type JobResponse = {
  id: string;
  title: string;
  description: string;
  seniorityLevel: string;
  department: string;
  salaryMin: number;
  salaryMax: number;
  status: JobStatus;
  recruiterId: string;
  companyId: string;
};

export type TechnologyDemandResponse = {
  technologyId: number;
  technologyName: string;
  technologyCategory: string;
  jobCount: number;
  mandatoryCount: number;
};

type ApiListResponse<T> = {
  success: boolean;
  message?: string;
  result: T[];
};

async function getJobs() {
  return httpClient.get<ApiListResponse<JobResponse>>("/jobs");
}

async function getTechnologyDemand() {
  return httpClient.get<ApiListResponse<TechnologyDemandResponse>>(
    "/market-radar/technology-demand",
  );
}

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });
}

export function useTechnologyDemand() {
  return useQuery({
    queryKey: ["market-radar", "technology-demand"],
    queryFn: getTechnologyDemand,
  });
}
