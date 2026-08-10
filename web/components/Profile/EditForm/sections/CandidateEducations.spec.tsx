import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CandidateEducations } from "./CandidateEducations";
import { INITIAL_MOCK_CANDIDATE } from "@/lib/mocks/candidateMock";
import { CandidateProfileResponse } from "@/lib/types/candidate";

const mockAddMutate = vi.fn();
const mockDeleteMutate = vi.fn();

vi.mock("@/lib/api/candidate/userProfileMutations", () => ({
  useAddEducationMutation: () => ({ mutate: mockAddMutate, isPending: false }),
  useDeleteEducationMutation: () => ({
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

describe("CandidateEducationsSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders educations section correctly", () => {
    renderWithClient(
      <CandidateEducations initialData={INITIAL_MOCK_CANDIDATE} />,
    );
    expect(screen.getByText(/Formação Acadêmica/i)).toBeInTheDocument();
  });

  it("adds an education when form is submitted", async () => {
    mockAddMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    });

    renderWithClient(
      <CandidateEducations initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    fireEvent.change(
      screen.getByPlaceholderText(/Ex: Universidade de São Paulo/i),
      { target: { value: "UNICAMP" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(/Ex: Ciência da Computação/i),
      { target: { value: "Engenharia de Software" } },
    );

    const addBtn = screen.getByRole("button", {
      name: /Adicionar Formação/i,
    });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(mockAddMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          institution: "UNICAMP",
          fieldOfStudy: "Engenharia de Software",
        }),
        expect.any(Object),
      );
    });
  });

  it("displays validation errors on empty submission", async () => {
    renderWithClient(<CandidateEducations initialData={null} />);

    const addBtn = screen.getByRole("button", {
      name: /Adicionar Formação/i,
    });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(screen.getByText(/Instituição obrigatória/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Área de estudo obrigatória/i),
      ).toBeInTheDocument();
    });
  });

  it("deletes an education on confirm", async () => {
    mockDeleteMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) options.onSuccess();
      if (options?.onError) options.onError(new Error("Err"));
    });

    renderWithClient(
      <CandidateEducations initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    const deleteBtns = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteBtns[0]);

    expect(screen.getByText(/Remover Formação Acadêmica/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", {
      name: /Confirmar Exclusão/i,
    });
    fireEvent.click(confirmBtn);

    expect(mockDeleteMutate).toHaveBeenCalled();
  });

  it("handles delete when education item id is empty", async () => {
    const mockDataNoId: CandidateProfileResponse = {
      ...INITIAL_MOCK_CANDIDATE,
      candidate: {
        ...INITIAL_MOCK_CANDIDATE.candidate,
        educations: [
          {
            id: "",
            institution: "USP",
            fieldOfStudy: "CS",
          },
        ],
      },
    };

    renderWithClient(<CandidateEducations initialData={mockDataNoId} />);

    const deleteBtns = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteBtns[0]);

    const confirmBtn = screen.getByRole("button", {
      name: /Confirmar Exclusão/i,
    });
    fireEvent.click(confirmBtn);

    expect(mockDeleteMutate).not.toHaveBeenCalled();
  });
});
