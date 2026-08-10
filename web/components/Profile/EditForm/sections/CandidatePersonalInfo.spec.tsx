import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CandidatePersonalInfo } from "./CandidatePersonalInfo";
import { INITIAL_MOCK_CANDIDATE } from "@/lib/mocks/candidateMock";
import { CandidateProfileResponse } from "@/lib/types/candidate";

const mockMutate = vi.fn();

vi.mock("@/lib/api/candidate/userProfileMutations", () => ({
  useUpdateUserMutation: () => ({ mutate: mockMutate, isPending: false }),
}));

function renderWithClient(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("CandidatePersonalInfoSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders personal info section correctly", () => {
    renderWithClient(
      <CandidatePersonalInfo initialData={INITIAL_MOCK_CANDIDATE} />,
    );
    expect(screen.getByText(/Informações Pessoais/i)).toBeInTheDocument();
  });

  it("submits personal info form with updated values and handles onSuccess", async () => {
    mockMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) {
        options.onSuccess({ candidate: null, address: null });
      }
    });

    renderWithClient(
      <CandidatePersonalInfo initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    const nameInput = screen.getByLabelText(/Nome Completo/i);
    fireEvent.change(nameInput, { target: { value: "Carlos Eduardo" } });

    const submitBtn = screen.getByRole("button", {
      name: /Salvar Dados Pessoais/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Carlos Eduardo",
        }),
        expect.any(Object),
      );
    });
  });

  it("updates form values when initialData changes", () => {
    const { rerender } = renderWithClient(
      <CandidatePersonalInfo initialData={null} />,
    );

    const newMock: CandidateProfileResponse = {
      ...INITIAL_MOCK_CANDIDATE,
      candidate: {
        ...INITIAL_MOCK_CANDIDATE.candidate,
        user: {
          ...INITIAL_MOCK_CANDIDATE.candidate.user,
          name: "Updated Name",
        },
      },
    };

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <CandidatePersonalInfo initialData={newMock} />
      </QueryClientProvider>,
    );

    expect(screen.getByDisplayValue("Updated Name")).toBeInTheDocument();
  });

  it("displays error when name is empty or too short", async () => {
    renderWithClient(
      <CandidatePersonalInfo initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    const nameInput = screen.getByLabelText(/Nome Completo/i);
    fireEvent.change(nameInput, { target: { value: "A" } });

    const submitBtn = screen.getByRole("button", {
      name: /Salvar Dados Pessoais/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/O nome deve ter no mínimo 2 caracteres/i),
      ).toBeInTheDocument();
    });
  });
});
