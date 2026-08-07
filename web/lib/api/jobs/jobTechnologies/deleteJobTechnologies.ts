import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";

export async function removeJobTechnology(
  jobId: string,
  technologyId: number,
): Promise<void> {
  await httpClient.delete(`/jobs/${jobId}/technologies/${technologyId}`);
}

export async function removeJobTechnologies(
  jobId: string,
  technologyIds: number[],
): Promise<void> {
  for (const technologyId of technologyIds) {
    await removeJobTechnology(jobId, technologyId);
  }
}

export function useRemoveJobTechnologiesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      technologyIds,
    }: {
      jobId: string;
      technologyIds: number[];
    }) => removeJobTechnologies(jobId, technologyIds),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"], exact: true });
      queryClient.invalidateQueries({
        queryKey: ["jobs", jobId, "technologies"],
        refetchType: "inactive",
      });
    },
  });
}
