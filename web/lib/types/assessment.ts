export type AssessmentDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type AssessmentStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELED";
export type QuestionSource = "INTERNAL" | "EXTERNAL";

export type AssessmentOption = {
  id: number;
  optionText: string;
};

export type AssessmentQuestion = {
  id: number;
  statement: string;
  difficultyLevel: AssessmentDifficulty;
  source: QuestionSource;
  options: AssessmentOption[];
};

export type TechnologyResponse = {
  id: number;
  name: string;
  category: string;
};

export type AssessmentStartResponse = {
  id: string;
  technologyResponse: TechnologyResponse;
  status: AssessmentStatus;
  questions: AssessmentQuestion[];
};

export type AnswerQuestionRequest = {
  questionId: number;
  selectedOptionId: number;
};

export type AssessmentSubmitResponse = {
  assessmentId: string;
  technologyName: string;
  status: AssessmentStatus;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
};

export type AssessmentResultOption = {
  id: number;
  optionText: string;
  isCorrect: boolean;
};

export type AssessmentResultQuestion = {
  questionId: number;
  statement: string;
  selectedOptionId: number;
  correctOptionId: number;
  isCorrect: boolean;
  options: AssessmentResultOption[];
};

export type AssessmentResultResponse = {
  assessmentId: string;
  technologyName: string;
  status: AssessmentStatus;
  difficulty: AssessmentDifficulty;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  questions: AssessmentResultQuestion[];
};

export type AssessmentHistoryItem = {
  assessmentId: string;
  status: AssessmentStatus;
  difficulty: AssessmentDifficulty;
  score: number;
  createdAt: string;
  completedAt: string | null;
};

export type AssessmentDifficultyStats = {
  difficulty: AssessmentDifficulty;
  testsCount: number;
  averageScore: number;
  assessments: AssessmentHistoryItem[];
};

export type AssessmentTechnologyHistory = {
  technologyName: string;
  difficulties: AssessmentDifficultyStats[];
};

export type AssessmentHistoryResponse = {
  candidateId: string;
  totalExecutedTests: number;
  historyByTechnology: AssessmentTechnologyHistory[];
};
