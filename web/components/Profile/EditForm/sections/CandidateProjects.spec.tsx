import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CandidateProjects } from "./CandidateProjects";
import { INITIAL_MOCK_CANDIDATE } from "@/lib/mocks/candidateMock";
import { CandidateProfileResponse } from "@/lib/types/candidate";

const mockAddMutate = vi.fn();
const mockDeleteMutate = vi.fn();

vi.mock("@/lib/api/candidate/userProfileMutations", () => ({
  useAddProjectMutation: () => ({ mutate: mockAddMutate, isPending: false }),
  useDeleteProjectMutation: () => ({
    mutate: mockDeleteMutate,
    isPending: false,
  }),
}));

function renderWithClient(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("CandidateProjectsSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders projects section correctly", () => {
    renderWithClient(
      <CandidateProjects initialData={INITIAL_MOCK_CANDIDATE} />,
    );
    expect(screen.getByText(/Projetos Relevantes/i)).toBeInTheDocument();
  });

  it("adds a project when form is submitted", async () => {
    mockAddMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    });

    renderWithClient(
      <CandidateProjects initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    fireEvent.change(
      screen.getByPlaceholderText(/Ex: Gemstone Seekers Platform/i),
      { target: { value: "My Open Source Lib" } },
    );

    const addBtn = screen.getByRole("button", {
      name: /Adicionar Projeto/i,
    });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(mockAddMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "My Open Source Lib",
        }),
        expect.any(Object),
      );
    });
  });

  it("displays validation errors on empty submission", async () => {
    renderWithClient(<CandidateProjects initialData={null} />);

    const addBtn = screen.getByRole("button", {
      name: /Adicionar Projeto/i,
    });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Nome do projeto obrigatório/i),
      ).toBeInTheDocument();
    });
  });

  it("deletes a project on confirm", async () => {
    mockDeleteMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) options.onSuccess();
      if (options?.onError) options.onError(new Error("Err"));
    });

    renderWithClient(
      <CandidateProjects initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    const deleteBtns = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteBtns[0]);

    expect(screen.getByText(/Remover Projeto/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", {
      name: /Confirmar Exclusão/i,
    });
    fireEvent.click(confirmBtn);

    expect(mockDeleteMutate).toHaveBeenCalled();
  });

  it("handles delete when project item id is empty", async () => {
    const mockDataNoId: CandidateProfileResponse = {
      ...INITIAL_MOCK_CANDIDATE,
      candidate: {
        ...INITIAL_MOCK_CANDIDATE.candidate,
        projects: [
          {
            id: "",
            name: "Proj",
          },
        ],
      },
    };

    renderWithClient(<CandidateProjects initialData={mockDataNoId} />);

    const deleteBtns = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteBtns[0]);

    const confirmBtn = screen.getByRole("button", {
      name: /Confirmar Exclusão/i,
    });
    fireEvent.click(confirmBtn);

    expect(mockDeleteMutate).not.toHaveBeenCalled();
  });
});
