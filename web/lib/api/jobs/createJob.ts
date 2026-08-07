import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Job, CreateJobInput } from "@/lib/types/job";
import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";

export async function createJob(input: CreateJobInput): Promise<Job> {
  const response = await httpClient.post<ApiResponse<Job>>("/jobs", input);
  return response.result;
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
