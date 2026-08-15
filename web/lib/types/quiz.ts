export type QuestionDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type QuestionOption = {
  id: string | number;
  text: string;
  optionText?: string;
  isCorrect?: boolean;
};

export type Question = {
  id: string | number;
  technologyId?: number;
  statement: string;
  difficulty: QuestionDifficulty;
  difficultyLevel?: QuestionDifficulty;
  source?: string;
  options: QuestionOption[];
};

export type TestStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELED";

export type Test = {
  id: string;
  candidateId: string;
  technologyId: number;
  status: TestStatus;
  questions: Question[];
};
