import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TestPage from "./page"; // Ajuste o caminho se necessário
import { useParams } from "next/navigation";

// 1. Mock do next/navigation
vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
}));

// 2. Mock dos dados do Quiz
vi.mock("@/lib/mocks/quizMock", () => ({
  quizMock: [
    {
      id: "quiz-1",
      questions: [
        {
          id: "q1",
          title: "Pergunta 1",
          options: [
            { id: "opt1", text: "Correta", isCorrect: true },
            { id: "opt2", text: "Errada", isCorrect: false },
          ],
        },
        {
          id: "q2",
          title: "Pergunta 2",
          options: [
            { id: "opt3", text: "Correta", isCorrect: true },
            { id: "opt4", text: "Errada", isCorrect: false },
          ],
        },
      ],
    },
  ],
}));

// 3. Mock dos componentes filhos para facilitar a verificação e focar na lógica do TestPage
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
  id: string;
  text: string;
  isCorrect: boolean;
};

type QuizQuestion = {
  id: string;
  title: string;
  options: QuizOption[];
};

vi.mock("@/components/quiz/QuizQuestion", () => ({
  QuizQuestion: ({
    currentQuestion,
    handleSetAnswer,
    handlePrevious,
    handleNext,
    selectedOptionId,
  }: {
    currentQuestion: QuizQuestion;
    handleSetAnswer: (_optionId: string) => void;
    handlePrevious: () => void;
    handleNext: () => void;
    selectedOptionId: string | null;
  }) => (
    <div data-testid="quiz-question">
      <h2>{currentQuestion.title}</h2>

      {currentQuestion.options.map((opt: QuizOption) => (
        <button
          key={opt.id}
          onClick={() => handleSetAnswer(opt.id)}
          data-selected={selectedOptionId === opt.id}
        >
          {opt.text}
        </button>
      ))}

      <button onClick={handlePrevious}>Anterior</button>
      <button onClick={handleNext} disabled={!selectedOptionId}>
        Próxima
      </button>
    </div>
  ),
}));

describe("TestPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar QuizNotFound quando o id passado na URL não existir", () => {
    vi.mocked(useParams).mockReturnValue({ id: "id-invalido" });

    render(<TestPage />);

    expect(screen.getByTestId("quiz-not-found")).toBeInTheDocument();
  });

  it("deve renderizar a primeira questão quando o id for válido", () => {
    vi.mocked(useParams).mockReturnValue({ id: "quiz-1" });

    render(<TestPage />);

    expect(screen.getByTestId("quiz-question")).toBeInTheDocument();
    expect(screen.getByText("Pergunta 1")).toBeInTheDocument();
  });

  it("deve permitir avançar e voltar entre as questões", () => {
    vi.mocked(useParams).mockReturnValue({ id: "quiz-1" });
    render(<TestPage />);

    fireEvent.click(screen.getByText("Correta"));

    fireEvent.click(screen.getByText("Próxima"));

    expect(screen.getByText("Pergunta 2")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Anterior"));

    expect(screen.getByText("Pergunta 1")).toBeInTheDocument();
  });

  it("não deve avançar se nenhuma opção for selecionada", () => {
    vi.mocked(useParams).mockReturnValue({ id: "quiz-1" });
    render(<TestPage />);

    const nextButton = screen.getByText("Próxima");

    expect(nextButton).toBeDisabled();

    fireEvent.click(nextButton);
    expect(screen.getByText("Pergunta 1")).toBeInTheDocument();
  });

  it("deve finalizar o quiz e calcular a pontuação corretamente", () => {
    vi.mocked(useParams).mockReturnValue({ id: "quiz-1" });
    render(<TestPage />);

    fireEvent.click(screen.getAllByText("Correta")[0]);
    fireEvent.click(screen.getByText("Próxima"));

    expect(screen.getByText("Pergunta 2")).toBeInTheDocument();
    fireEvent.click(screen.getAllByText("Errada")[0]);

    fireEvent.click(screen.getByText("Próxima"));

    expect(screen.getByTestId("quiz-result")).toBeInTheDocument();
    expect(screen.getByText("Resultado: 1 de 2")).toBeInTheDocument();
  });
});
