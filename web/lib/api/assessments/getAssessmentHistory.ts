import { httpClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/api/response";
import { AssessmentHistoryResponse } from "@/lib/types/assessment";

export async function getAssessmentHistory(filters?: {
  technology?: string;
  status?: "IN_PROGRESS" | "COMPLETED" | "CANCELED";
}): Promise<AssessmentHistoryResponse> {
  const params = new URLSearchParams();
  if (filters?.technology) {
    params.append("technology", filters.technology);
  }
  if (filters?.status) {
    params.append("status", filters.status);
  }

  const url = `/assessments/history${params.toString() ? `?${params.toString()}` : ""}`;
  const response =
    await httpClient.get<ApiResponse<AssessmentHistoryResponse>>(url);
  return response.result;
}
