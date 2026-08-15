import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";
import {
  AssessmentStartResponse,
  AssessmentDifficulty,
} from "@/lib/types/assessment";

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
