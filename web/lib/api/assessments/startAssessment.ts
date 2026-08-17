import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";
import {
  AssessmentStartResponse,
  AssessmentDifficulty,
} from "@/lib/types/assessment";
import { useMutation } from "@tanstack/react-query";

export async function startAssessment(
  technology: string,
  difficulty?: AssessmentDifficulty,
): Promise<AssessmentStartResponse> {
  const params = new URLSearchParams();
  if (difficulty) {
    params.append("difficulty", difficulty);
  }

  const url = `/assessments/start/${technology}${params.toString() ? `?${params.toString()}` : ""}`;
  const response =
    await httpClient.post<ApiResponse<AssessmentStartResponse>>(url);
  return response.result;
}

export function useStartAssessmentMutation() {
  return useMutation({
    mutationFn: ({
      technology,
      difficulty,
    }: {
      technology: string;
      difficulty?: AssessmentDifficulty;
    }) => startAssessment(technology, difficulty),
  });
}
