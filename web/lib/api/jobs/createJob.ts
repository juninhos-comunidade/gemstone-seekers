import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Job, CreateJobInput } from "@/lib/types/job";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";

export async function createJob(input: CreateJobInput): Promise<Job> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const newJob: Job = {
    id: `job-${Date.now()}`,
    recruiterId: "rec-01",
    companyId: "comp-01",
    companyName: input.companyName || "Gemstone Tech Solutions",
    companyCnpj: "12.345.678/0001-90",
    title: input.title,
    description: input.description,
    seniorityLevel: input.seniorityLevel,
    department: input.department,
    salaryMin: input.salaryMin,
    salaryMax: input.salaryMax,
    status: input.status,
    technologies: input.technologies || [],
    location: input.location,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  MOCK_JOBS.unshift(newJob);
  return newJob;
}

export function useCreateJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateJobInput) => createJob(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
