import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QuizNotFound } from "./QuizNotFound";

// Mock do Next.js router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
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

  it("renders the back to tests button", () => {
    render(<QuizNotFound />);
    expect(screen.getByText("Voltar aos testes")).toBeInTheDocument();
  });

  it("navigates to tests page when button is clicked", () => {
    render(<QuizNotFound />);
    const backButton = screen.getByText("Voltar aos testes");
    fireEvent.click(backButton);
    expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard/tests");
  });
});
