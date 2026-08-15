import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";
import { AssessmentSubmitResponse } from "@/lib/types/assessment";

export async function submitAssessment(
  assessmentId: string,
): Promise<AssessmentSubmitResponse> {
  const response = await httpClient.post<ApiResponse<AssessmentSubmitResponse>>(
    `/assessments/${assessmentId}/submit`,
  );
  return response.result;
}
