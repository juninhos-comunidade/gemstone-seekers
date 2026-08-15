import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QuizResult } from "./QuizResult";

// Mock do Next.js router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("QuizResult", () => {
  it("renders the component correctly", () => {
    render(<QuizResult score={3} totalQuestions={5} />);
    expect(screen.getByText("Teste concluído!")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("de 5")).toBeInTheDocument();
  });

  it("shows Excelente performance for 80%+ score", () => {
    render(<QuizResult score={8} totalQuestions={10} />);
    expect(screen.getByText("Excelente")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("shows Bom performance for 60-79% score", () => {
    render(<QuizResult score={6} totalQuestions={10} />);
    expect(screen.getByText("Bom")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("shows Regular performance for 40-59% score", () => {
    render(<QuizResult score={4} totalQuestions={10} />);
    expect(screen.getByText("Regular")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("shows Precisa melhorar performance for <40% score", () => {
    render(<QuizResult score={3} totalQuestions={10} />);
    expect(screen.getByText("Precisa melhorar")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    render(<QuizResult score={5} totalQuestions={10} />);
    expect(screen.getByText("Voltar aos testes")).toBeInTheDocument();
    expect(screen.getByText("Ir para dashboard")).toBeInTheDocument();
  });

  it("navigates to /candidate/dashboard/tests when back button is clicked", () => {
    render(<QuizResult score={5} totalQuestions={10} />);
    const backButton = screen.getByText("Voltar aos testes");
    fireEvent.click(backButton);
    expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard/tests");
  });

  it("navigates to /candidate/dashboard when dashboard button is clicked", () => {
    render(<QuizResult score={5} totalQuestions={10} />);
    const dashboardButton = screen.getByText("Ir para dashboard");
    fireEvent.click(dashboardButton);
    expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
  });
});
