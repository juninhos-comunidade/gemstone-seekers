import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QuizCloseModal } from "./QuizCloseModal";

// Mock do Next.js router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("QuizCloseModal", () => {
  it("renders the close button correctly", () => {
    render(<QuizCloseModal />);

    const closeButton = screen.getByLabelText("Fechar quiz");
    expect(closeButton).toBeInTheDocument();
  });

  it("opens the modal when close button is clicked", async () => {
    render(<QuizCloseModal />);

    const closeButton = screen.getByLabelText("Fechar quiz");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.getByText("Fechar Quiz")).toBeInTheDocument();
    });
  });

  it("displays the confirmation message", async () => {
    render(<QuizCloseModal />);

    const closeButton = screen.getByLabelText("Fechar quiz");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.getByText(/Deseja sair/)).toBeInTheDocument();
      expect(screen.getByText(/cancelar o quiz/)).toBeInTheDocument();
    });
  });

  it("renders Sim and Não buttons in the modal", async () => {
    render(<QuizCloseModal />);

    const closeButton = screen.getByLabelText("Fechar quiz");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.getByText("Sim")).toBeInTheDocument();
      expect(screen.getByText("Não")).toBeInTheDocument();
    });
  });

  it("closes the modal when Não button is clicked", async () => {
    render(<QuizCloseModal />);

    const closeButton = screen.getByLabelText("Fechar quiz");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.getByText("Fechar Quiz")).toBeInTheDocument();
    });

    const naoButton = screen.getByText("Não");
    fireEvent.click(naoButton);

    await waitFor(() => {
      expect(screen.queryByText("Fechar Quiz")).not.toBeInTheDocument();
    });
  });

  it("navigates to dashboard/tests when Sim button is clicked", async () => {
    render(<QuizCloseModal />);

    const closeButton = screen.getByLabelText("Fechar quiz");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.getByText("Fechar Quiz")).toBeInTheDocument();
    });

    const simButton = screen.getByText("Sim");
    fireEvent.click(simButton);

    expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard/tests");
  });

  it("calls onCancel callback when Sim button is clicked", async () => {
    const onCancel = vi.fn();
    render(<QuizCloseModal onCancel={onCancel} />);

    const closeButton = screen.getByLabelText("Fechar quiz");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.getByText("Fechar Quiz")).toBeInTheDocument();
    });

    const simButton = screen.getByText("Sim");
    fireEvent.click(simButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it("does not call onCancel when Não button is clicked", async () => {
    const onCancel = vi.fn();
    render(<QuizCloseModal onCancel={onCancel} />);

    const closeButton = screen.getByLabelText("Fechar quiz");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.getByText("Fechar Quiz")).toBeInTheDocument();
    });

    const naoButton = screen.getByText("Não");
    fireEvent.click(naoButton);

    expect(onCancel).not.toHaveBeenCalled();
  });
});
