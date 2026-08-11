import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QuizProgress } from "./QuizProgress";

describe("QuizProgress", () => {
  it("renders the component correctly", () => {
    render(
      <QuizProgress progressPercent={50} currentIndex={1} totalQuestions={4} />,
    );
    expect(screen.getByText("Questão 2 de 4")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "50",
    );
  });
});
