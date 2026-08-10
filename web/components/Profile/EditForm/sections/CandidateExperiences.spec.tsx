import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CandidateExperiences } from "./CandidateExperiences";
import { INITIAL_MOCK_CANDIDATE } from "@/lib/mocks/candidateMock";
import { CandidateProfileResponse } from "@/lib/types/candidate";

const mockAddMutate = vi.fn();
const mockDeleteMutate = vi.fn();

vi.mock("@/lib/api/candidate/userProfileMutations", () => ({
  useAddExperienceMutation: () => ({ mutate: mockAddMutate, isPending: false }),
  useDeleteExperienceMutation: () => ({
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

describe("CandidateExperiencesSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders experiences section correctly", () => {
    renderWithClient(
      <CandidateExperiences initialData={INITIAL_MOCK_CANDIDATE} />,
    );
    expect(screen.getByText(/Experiência Profissional/i)).toBeInTheDocument();
  });

  it("adds an experience when form is submitted and toggles isCurrent", async () => {
    mockAddMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    });

    renderWithClient(
      <CandidateExperiences initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    fireEvent.change(
      screen.getByPlaceholderText(/Ex: Desenvolvedor Front-end Senior/i),
      { target: { value: "Lead Eng" } },
    );
    fireEvent.change(screen.getByPlaceholderText(/Ex: TechLab Studio/i), {
      target: { value: "Acme Inc" },
    });
    const startDateInput = screen.getAllByDisplayValue("")[0];
    fireEvent.change(startDateInput, { target: { value: "2023-01-01" } });

    const checkbox = screen.getByRole("checkbox", {
      name: /Trabalho atualmente aqui/i,
    });
    fireEvent.click(checkbox);

    const addBtn = screen.getByRole("button", {
      name: /Adicionar Experiência/i,
    });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(mockAddMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Lead Eng",
          companyName: "Acme Inc",
          startDate: "2023-01-01",
          isCurrent: true,
        }),
        expect.any(Object),
      );
    });
  });

  it("displays validation errors on empty submission", async () => {
    renderWithClient(<CandidateExperiences initialData={null} />);

    const addBtn = screen.getByRole("button", {
      name: /Adicionar Experiência/i,
    });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Cargo\/Título obrigatório/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Empresa obrigatória/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Data de início obrigatória/i),
      ).toBeInTheDocument();
    });
  });

  it("deletes an experience on confirm", async () => {
    mockDeleteMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) options.onSuccess();
      if (options?.onError) options.onError(new Error("Err"));
    });

    renderWithClient(
      <CandidateExperiences initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    const deleteBtns = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteBtns[0]);

    expect(screen.getByText(/Remover Experiência/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", {
      name: /Confirmar Exclusão/i,
    });
    fireEvent.click(confirmBtn);

    expect(mockDeleteMutate).toHaveBeenCalled();
  });

  it("handles delete when experience item id is empty", async () => {
    const mockDataNoId: CandidateProfileResponse = {
      ...INITIAL_MOCK_CANDIDATE,
      candidate: {
        ...INITIAL_MOCK_CANDIDATE.candidate,
        experiences: [
          {
            id: "",
            title: "T",
            companyName: "C",
            startDate: "2020-01-01",
            isCurrent: true,
          },
        ],
      },
    };

    renderWithClient(<CandidateExperiences initialData={mockDataNoId} />);

    const deleteBtns = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteBtns[0]);

    const confirmBtn = screen.getByRole("button", {
      name: /Confirmar Exclusão/i,
    });
    fireEvent.click(confirmBtn);

    expect(mockDeleteMutate).not.toHaveBeenCalled();
  });
});
