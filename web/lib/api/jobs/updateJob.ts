import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Job, UpdateJobInput } from "@/lib/types/job";
import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";

export interface UpdateJobParams {
  id: string;
  data: UpdateJobInput;
}

export async function updateJob(
  id: string,
  input: UpdateJobInput,
): Promise<Job> {
  const response = await httpClient.put<ApiResponse<Job>>(`/jobs/${id}`, input);
  return response.result;
}

export function useUpdateJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateJobParams) => updateJob(id, data),
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"], exact: true });
      queryClient.invalidateQueries({
        queryKey: ["jobs", job.id],
        refetchType: "inactive",
      });
    },
  });
}
