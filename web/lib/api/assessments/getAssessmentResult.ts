import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";
import { AssessmentResultResponse } from "@/lib/types/assessment";

export async function getAssessmentResult(
  assessmentId: string,
): Promise<AssessmentResultResponse> {
  const response = await httpClient.get<ApiResponse<AssessmentResultResponse>>(
    `/assessments/${assessmentId}/result`,
  );
  return response.result;
}
