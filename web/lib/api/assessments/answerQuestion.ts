import { httpClient } from "@/lib/api/client";
import { AnswerQuestionRequest } from "@/lib/types/assessment";

export async function answerQuestion(
  assessmentId: string,
  questionId: number,
  selectedOptionId: number,
): Promise<void> {
  const data: AnswerQuestionRequest = {
    questionId,
    selectedOptionId,
  };

  await httpClient.put(
    `/assessments/${assessmentId}/answers/${questionId}`,
    data,
  );
}
