import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";

export async function deleteJob(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const index = MOCK_JOBS.findIndex((j) => j.id === id);
  if (index !== -1) {
    MOCK_JOBS.splice(index, 1);
  }
  return true;
}

export function useDeleteJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
