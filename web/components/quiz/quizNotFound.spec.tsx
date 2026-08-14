import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QuizNotFound } from "./QuizNotFound";

// Mock do Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("QuizNotFound", () => {
  it("renders the component correctly", () => {
    render(<QuizNotFound />);
    expect(screen.getByText("Teste não encontrado")).toBeInTheDocument();
    expect(
      screen.getByText("O questionário solicitado não existe ou foi removido."),
    ).toBeInTheDocument();
  });
});
