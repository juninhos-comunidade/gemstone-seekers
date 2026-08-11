export type QuestionDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type QuestionOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  technologyId: number;
  statement: string;
  difficulty: QuestionDifficulty;
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
