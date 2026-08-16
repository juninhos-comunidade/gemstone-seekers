import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TestPage from "./page";
import { useParams } from "next/navigation";
import { startAssessment } from "@/lib/api/assessments";

// Mock do next/navigation
vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock das funções da API de assessments
vi.mock("@/lib/api/assessments", () => ({
  startAssessment: vi.fn(),
  answerQuestion: vi.fn(),
  submitAssessment: vi.fn(),
  getAssessmentResult: vi.fn(),
  cancelAssessment: vi.fn(),
}));

// Mock dos componentes filhos
vi.mock("@/components/quiz/QuizNotFound", () => ({
  QuizNotFound: () => (
    <div data-testid="quiz-not-found">Quiz não encontrado</div>
  ),
}));

vi.mock("@/components/quiz/QuizResult", () => ({
  QuizResult: ({
    score,
    totalQuestions,
  }: {
    score: number;
    totalQuestions: number;
  }) => (
    <div data-testid="quiz-result">
      Resultado: {score} de {totalQuestions}
    </div>
  ),
}));

type QuizOption = {
  id: number;
  optionText: string;
};

type QuizQuestion = {
  id: number;
  statement: string;
  options: QuizOption[];
};

vi.mock("@/components/quiz/QuizQuestion", () => ({
  QuizQuestion: ({
    currentQuestion,
    handleSetAnswer,
    handlePrevious,
    handleNext,
    selectedOptionId,
    isLastQuestion,
  }: {
    currentQuestion: QuizQuestion;
    handleSetAnswer: (_optionId: string) => void;
    handlePrevious: () => void;
    handleNext: () => void;
    selectedOptionId: string;
    isLastQuestion: boolean;
  }) => (
    <div data-testid="quiz-question">
      <h2>{currentQuestion.statement}</h2>

      {currentQuestion.options.map((opt: QuizOption) => (
        <button
          key={opt.id}
          onClick={() => handleSetAnswer(opt.id.toString())}
          data-selected={selectedOptionId === opt.id.toString()}
        >
          {opt.optionText}
        </button>
      ))}

      <button onClick={handlePrevious}>Anterior</button>
      <button onClick={handleNext} disabled={!selectedOptionId}>
        {isLastQuestion ? "Finalizar" : "Próxima"}
      </button>
    </div>
  ),
}));

describe("TestPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar loading state inicialmente", () => {
    vi.mocked(useParams).mockReturnValue({ id: "javascript" });
    vi.mocked(startAssessment).mockImplementation(() => new Promise(() => {}));

    render(<TestPage />);

    expect(screen.getByText("Carregando teste...")).toBeInTheDocument();
  });

  it("deve renderizar QuizNotFound quando houver erro ao iniciar assessment", async () => {
    vi.mocked(useParams).mockReturnValue({ id: "invalid-tech" });
    vi.mocked(startAssessment).mockRejectedValue(
      new Error("Technology not found"),
    );

    render(<TestPage />);

    await waitFor(() => {
      expect(screen.getByText("Erro")).toBeInTheDocument();
    });
  });
});
