import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QuizQuestion } from "./QuizQuestion";
import { Question } from "@/lib/types/quiz";

describe("QuizQuestion", () => {
  //   id: string;
  //   technologyId: number;
  //   statement: string;
  //   difficulty: QuestionDifficulty;
  //   options: QuestionOption[];
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

    expect(screen.getByText("Anterior")).toBeDisabled();
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
  });
});
