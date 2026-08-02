import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Job, UpdateJobInput } from "@/lib/types/job";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";

export async function updateJob(input: UpdateJobInput): Promise<Job> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const index = MOCK_JOBS.findIndex((j) => j.id === input.id);
  const existing = MOCK_JOBS[index];

  const updated: Job = {
    ...existing,
    title: input.title,
    companyName:
      input.companyName || existing?.companyName || "Gemstone Tech Solutions",
    department: input.department,
    seniorityLevel: input.seniorityLevel,
    location: input.location,
    status: input.status,
    salaryMin: input.salaryMin,
    salaryMax: input.salaryMax,
    description: input.description,
    technologies: input.technologies,
    updatedAt: new Date().toISOString(),
  };

  if (index !== -1) {
    MOCK_JOBS[index] = updated;
  }

  return updated;
}

export function useUpdateJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateJobInput) => updateJob(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", variables.id] });
    },
  });
}
