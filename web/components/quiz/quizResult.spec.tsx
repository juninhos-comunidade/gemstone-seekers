import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QuizResult } from "./QuizResult";

describe("QuizResult", () => {
  it("renders the component correctly", () => {
    render(<QuizResult score={3} totalQuestions={5} />);
    expect(screen.getByText("Teste concluído!")).toBeInTheDocument();
    expect(
      screen.getByText("Você acertou 3 de 5 questões."),
    ).toBeInTheDocument();
  });
});
