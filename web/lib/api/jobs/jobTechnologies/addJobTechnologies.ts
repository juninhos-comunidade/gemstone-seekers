import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddJobTechnologyInput } from "@/lib/types/job";
import { httpClient } from "@/lib/api/client";

export async function addJobTechnology(
  jobId: string,
  input: AddJobTechnologyInput,
): Promise<void> {
  await httpClient.post(`/jobs/${jobId}/technologies`, input);
}

export async function addJobTechnologies(
  jobId: string,
  technologies: AddJobTechnologyInput[],
): Promise<void> {
  for (const tech of technologies) {
    await addJobTechnology(jobId, tech);
  }
}

export function useAddJobTechnologiesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      technologies,
    }: {
      jobId: string;
      technologies: AddJobTechnologyInput[];
    }) => addJobTechnologies(jobId, technologies),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"], exact: true });
      queryClient.invalidateQueries({
        queryKey: ["jobs", jobId, "technologies"],
        refetchType: "inactive",
      });
    },
  });
}
