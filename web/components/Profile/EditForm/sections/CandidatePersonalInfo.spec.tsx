import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CandidatePersonalInfo } from "./CandidatePersonalInfo";
import { INITIAL_MOCK_CANDIDATE } from "@/lib/mocks/candidateMock";

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

  it("submits personal info form with valid values", async () => {
    mockMutate.mockImplementation((_, options) => options?.onSuccess?.());

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
        expect.objectContaining({ name: "Carlos Eduardo" }),
        expect.any(Object),
      );
    });
  });

  it("displays error when validation fails", async () => {
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
