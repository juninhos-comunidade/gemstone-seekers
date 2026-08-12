import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CandidateLinks } from "./CandidateLinks";
import { INITIAL_MOCK_CANDIDATE } from "@/lib/mocks/candidateMock";
import { CandidateProfileResponse } from "@/lib/types/candidate";

const mockAddMutate = vi.fn();
const mockDeleteMutate = vi.fn();

vi.mock("@/lib/api/candidate/userProfileMutations", () => ({
  useAddLinkMutation: () => ({ mutate: mockAddMutate, isPending: false }),
  useDeleteLinkMutation: () => ({ mutate: mockDeleteMutate, isPending: false }),
}));

function renderWithClient(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("CandidateLinksSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders links section correctly", () => {
    renderWithClient(<CandidateLinks initialData={INITIAL_MOCK_CANDIDATE} />);
    expect(screen.getByText(/Links & Redes Sociais/i)).toBeInTheDocument();
  });

  it("adds a new link when form is filled and submitted", async () => {
    mockAddMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    });

    renderWithClient(<CandidateLinks initialData={INITIAL_MOCK_CANDIDATE} />);

    const nameInput = screen.getByPlaceholderText(/Ex: GitHub, LinkedIn/i);
    const urlInput = screen.getByPlaceholderText(
      /Ex: https:\/\/github.com\/usuario/i,
    );

    fireEvent.change(nameInput, { target: { value: "Portfolio" } });
    fireEvent.change(urlInput, {
      target: { value: "https://portfolio.com" },
    });

    const addBtn = screen.getByRole("button", { name: /Adicionar Link/i });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(mockAddMutate).toHaveBeenCalledWith(
        { name: "Portfolio", url: "https://portfolio.com" },
        expect.any(Object),
      );
    });
  });

  it("displays validation errors on empty submission", async () => {
    renderWithClient(<CandidateLinks initialData={null} />);

    const addBtn = screen.getByRole("button", { name: /Adicionar Link/i });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(screen.getByText(/Nome do link obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/URL obrigatória/i)).toBeInTheDocument();
    });
  });

  it("opens confirm delete dialog, confirms, and handles delete mutation", async () => {
    mockDeleteMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    });

    renderWithClient(<CandidateLinks initialData={INITIAL_MOCK_CANDIDATE} />);

    const deleteBtns = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteBtns[0]);

    expect(screen.getByText(/Remover Link/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", {
      name: /Confirmar Exclusão/i,
    });
    fireEvent.click(confirmBtn);

    expect(mockDeleteMutate).toHaveBeenCalled();
  });

  it("cancels deletion when cancel button is clicked in dialog", async () => {
    renderWithClient(<CandidateLinks initialData={INITIAL_MOCK_CANDIDATE} />);

    const deleteBtns = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteBtns[0]);

    const cancelBtn = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(screen.queryByText(/Remover Link/i)).not.toBeInTheDocument();
    });
  });

  it("handles delete when item id is empty string", async () => {
    const mockDataNoId: CandidateProfileResponse = {
      ...INITIAL_MOCK_CANDIDATE,
      candidate: {
        ...INITIAL_MOCK_CANDIDATE.candidate,
        links: [{ id: "", name: "No ID", url: "https://noid.com" }],
      },
    };

    renderWithClient(<CandidateLinks initialData={mockDataNoId} />);

    const deleteBtns = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteBtns[0]);

    const confirmBtn = screen.getByRole("button", {
      name: /Confirmar Exclusão/i,
    });
    fireEvent.click(confirmBtn);

    expect(mockDeleteMutate).not.toHaveBeenCalled();
  });
});
