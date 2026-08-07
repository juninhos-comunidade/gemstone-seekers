import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/api/client";

export async function deleteJob(id: string): Promise<void> {
  await httpClient.delete(`/jobs/${id}`);
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
