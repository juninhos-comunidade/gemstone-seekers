import { httpClient } from "@/lib/api/client";

export async function cancelAssessment(assessmentId: string): Promise<void> {
  await httpClient.post(`/assessments/${assessmentId}/cancel`);
}
