import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CandidateLanguages } from "./CandidateLanguages";
import { INITIAL_MOCK_CANDIDATE } from "@/lib/mocks/candidateMock";
import { CandidateProfileResponse } from "@/lib/types/candidate";

const mockAddMutate = vi.fn();
const mockDeleteMutate = vi.fn();

vi.mock("@/lib/api/candidate/userProfileMutations", () => ({
  useAddLanguageMutation: () => ({ mutate: mockAddMutate, isPending: false }),
  useDeleteLanguageMutation: () => ({
    mutate: mockDeleteMutate,
    isPending: false,
  }),
}));

vi.mock("@/lib/api/languages/languages", () => ({
  useLanguagesQuery: () => ({
    data: [
      { id: 1, name: "Português" },
      { id: 2, name: "Inglês" },
      { id: 3, name: "Alemão" },
    ],
    isLoading: false,
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

describe("CandidateLanguagesSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders languages section correctly", () => {
    renderWithClient(
      <CandidateLanguages initialData={INITIAL_MOCK_CANDIDATE} />,
    );
    expect(screen.getByText(/Idiomas & Proficiência/i)).toBeInTheDocument();
  });

  it("adds a language when form is submitted", async () => {
    mockAddMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    });

    renderWithClient(
      <CandidateLanguages initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    const selectTrigger = screen.getByLabelText(/Idioma/i);
    fireEvent.click(selectTrigger);

    const option = await screen.findByRole("option", { name: "Alemão" });
    fireEvent.pointerDown(option);
    fireEvent.click(option);

    const addBtn = screen.getByRole("button", { name: /Adicionar Idioma/i });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(mockAddMutate).toHaveBeenCalledWith(
        { languageName: "Alemão", proficiency: "INTERMEDIATE" },
        expect.any(Object),
      );
    });
  });

  it("shows validation error on empty submission", async () => {
    renderWithClient(<CandidateLanguages initialData={null} />);

    const addBtn = screen.getByRole("button", { name: /Adicionar Idioma/i });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Nome do idioma obrigatório/i),
      ).toBeInTheDocument();
    });
  });

  it("deletes a language on confirm", async () => {
    mockDeleteMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) options.onSuccess();
      if (options?.onError) options.onError(new Error("Err"));
    });

    renderWithClient(
      <CandidateLanguages initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    const deleteBtns = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteBtns[0]);

    expect(screen.getByText(/Remover Idioma/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", {
      name: /Confirmar Exclusão/i,
    });
    fireEvent.click(confirmBtn);

    expect(mockDeleteMutate).toHaveBeenCalled();
  });

  it("handles delete when languageId is missing", async () => {
    const mockDataNoLangId: CandidateProfileResponse = {
      ...INITIAL_MOCK_CANDIDATE,
      candidate: {
        ...INITIAL_MOCK_CANDIDATE.candidate,
        languages: [
          {
            languageId: undefined,
            languageName: "No ID",
            proficiency: "BASIC",
          },
        ],
      },
    };

    renderWithClient(<CandidateLanguages initialData={mockDataNoLangId} />);

    const deleteBtns = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteBtns[0]);

    const confirmBtn = screen.getByRole("button", {
      name: /Confirmar Exclusão/i,
    });
    fireEvent.click(confirmBtn);

    expect(mockDeleteMutate).not.toHaveBeenCalled();
  });
});
