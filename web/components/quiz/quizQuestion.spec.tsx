import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QuizQuestion } from "./QuizQuestion";
import { Question } from "@/lib/types/quiz";

// Mock do Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("QuizQuestion", () => {
  const mockQuestion = {
    id: "1",
    technologyId: 1,
    statement: "Qual é a capital da França?",
    difficulty: "BEGINNER",
    options: [
      { id: "a", text: "Londres", isCorrect: false },
      { id: "b", text: "Berlim", isCorrect: false },
      { id: "c", text: "Paris", isCorrect: true },
      { id: "d", text: "Madrid", isCorrect: false },
    ],
  } satisfies Question;

  it("renders the component correctly", () => {
    render(
      <QuizQuestion
        progressPercent={50}
        currentIndex={1}
        totalQuestions={4}
        currentQuestion={mockQuestion}
        selectedOptionId="c"
        handleSetAnswer={() => {}}
        handlePrevious={() => {}}
        handleNext={() => {}}
        isLastQuestion={false}
      />,
    );

    expect(screen.getByText("Questão 2 de 4")).toBeInTheDocument();
    expect(screen.getByText("Qual é a capital da França?")).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
  });

  it("disables the previous button on the first question", () => {
    render(
      <QuizQuestion
        progressPercent={0}
        currentIndex={0}
        totalQuestions={4}
        currentQuestion={mockQuestion}
        selectedOptionId=""
        handleSetAnswer={() => {}}
        handlePrevious={() => {}}
        handleNext={() => {}}
        isLastQuestion={false}
      />,
    );

    const previousButton = screen.getByText("Anterior");
    expect(previousButton).toBeDisabled();
  });

  it("changes 'Próxima' button text to 'Finalizar' on the last question", () => {
    render(
      <QuizQuestion
        progressPercent={100}
        currentIndex={3}
        totalQuestions={4}
        currentQuestion={mockQuestion}
        selectedOptionId="a"
        handleSetAnswer={() => {}}
        handlePrevious={() => {}}
        handleNext={() => {}}
        isLastQuestion={true}
      />,
    );

    expect(screen.getByText("Finalizar")).toBeInTheDocument();
    expect(screen.queryByText("Próxima")).not.toBeInTheDocument();
  });

  it("calls handleSetAnswer when an option is selected", () => {
    const handleSetAnswer = vi.fn();
    render(
      <QuizQuestion
        progressPercent={25}
        currentIndex={0}
        totalQuestions={4}
        currentQuestion={mockQuestion}
        selectedOptionId=""
        handleSetAnswer={handleSetAnswer}
        handlePrevious={() => {}}
        handleNext={() => {}}
        isLastQuestion={false}
      />,
    );

    const option = screen.getByText("Paris");
    fireEvent.click(option);
    expect(handleSetAnswer).toHaveBeenCalledWith("c");
  });

  it("calls handlePrevious when previous button is clicked", () => {
    const handlePrevious = vi.fn();
    render(
      <QuizQuestion
        progressPercent={50}
        currentIndex={1}
        totalQuestions={4}
        currentQuestion={mockQuestion}
        selectedOptionId="a"
        handleSetAnswer={() => {}}
        handlePrevious={handlePrevious}
        handleNext={() => {}}
        isLastQuestion={false}
      />,
    );

    const previousButton = screen.getByText("Anterior");
    fireEvent.click(previousButton);
    expect(handlePrevious).toHaveBeenCalled();
  });

  it("calls handleNext when next button is clicked", () => {
    const handleNext = vi.fn();
    render(
      <QuizQuestion
        progressPercent={25}
        currentIndex={0}
        totalQuestions={4}
        currentQuestion={mockQuestion}
        selectedOptionId="a"
        handleSetAnswer={() => {}}
        handlePrevious={() => {}}
        handleNext={handleNext}
        isLastQuestion={false}
      />,
    );

    const nextButton = screen.getByText("Próxima");
    fireEvent.click(nextButton);
    expect(handleNext).toHaveBeenCalled();
  });

  it("displays progress percentage correctly", () => {
    render(
      <QuizQuestion
        progressPercent={75}
        currentIndex={2}
        totalQuestions={4}
        currentQuestion={mockQuestion}
        selectedOptionId="a"
        handleSetAnswer={() => {}}
        handlePrevious={() => {}}
        handleNext={() => {}}
        isLastQuestion={false}
      />,
    );

    expect(screen.getByText("75%")).toBeInTheDocument();
  });
});
