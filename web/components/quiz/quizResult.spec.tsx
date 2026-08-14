import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QuizResult } from "./QuizResult";

// Mock do Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("QuizResult", () => {
  it("renders the component correctly", () => {
    render(<QuizResult score={3} totalQuestions={5} />);
    expect(screen.getByText("Teste concluído!")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("de 5")).toBeInTheDocument();
  });
});
