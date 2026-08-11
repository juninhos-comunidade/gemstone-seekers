type QuestionDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

type QuestionOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  technologyId: number;
  statement: string;
  difficulty: QuestionDifficulty;
  options: QuestionOption[];
};

type TestStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELED";

export type Questionario = {
  id: string;
  candidateId: string;
  technologyId: number;
  status: TestStatus;
  questions: Question[];
  Tech: string;
  Titulo: string;
  Descricao: string;
  NumQuestoes: number;
  Nivel: string;
};

type QuestionarioInput = Omit<
  Questionario,
  "candidateId" | "status" | "questions"
> & {
  id: string;
  technologyId: number;
};

const createQuestionario = ({
  id,
  technologyId,
  ...rest
}: QuestionarioInput): Questionario => ({
  id,
  candidateId: "candidate-001",
  technologyId,
  status: "IN_PROGRESS",
  questions: [],
  ...rest,
});

export const questionarios: Questionario[] = [
  createQuestionario({
    id: "test-js-001",
    technologyId: 1,
    Tech: "JavaScript",
    Titulo: "JavaScript para Iniciantes",
    Descricao: "Teste sobre os conceitos básicos da linguagem JavaScript.",
    NumQuestoes: 3,
    Nivel: "iniciante",
  }),
  createQuestionario({
    id: "test-ts-001",
    technologyId: 2,
    Tech: "TypeScript",
    Titulo: "TypeScript para Iniciantes",
    Descricao: "Teste sobre tipos básicos, variáveis e funções em TypeScript.",
    NumQuestoes: 3,
    Nivel: "iniciante",
  }),
  createQuestionario({
    id: "test-py-001",
    technologyId: 3,
    Tech: "Python",
    Titulo: "Python para Iniciantes",
    Descricao:
      "Teste sobre variáveis, listas, condicionais e estruturas de repetição.",
    NumQuestoes: 3,
    Nivel: "iniciante",
  }),
  createQuestionario({
    id: "test-java-001",
    technologyId: 4,
    Tech: "Java",
    Titulo: "Java para Iniciantes",
    Descricao:
      "Teste sobre sintaxe, variáveis, métodos e estruturas de controle.",
    NumQuestoes: 3,
    Nivel: "iniciante",
  }),
];
