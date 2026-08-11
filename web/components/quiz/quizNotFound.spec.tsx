import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QuizNotFound } from "./QuizNotFound";

describe("QuizNotFound", () => {
  it("renders the component correctly", () => {
    render(<QuizNotFound />);
    expect(screen.getByText("Teste não encontrado")).toBeInTheDocument();
    expect(
      screen.getByText("O questionário solicitado não existe ou foi removido."),
    ).toBeInTheDocument();
  });
});
