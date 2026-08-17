import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CandidatePersonalInfo } from "./CandidatePersonalInfo";
import { INITIAL_MOCK_CANDIDATE } from "@/lib/mocks/candidateMock";
import { CandidateProfileResponse } from "@/lib/types/candidate";

const mockMutate = vi.fn();
let mockIsPending = false;

vi.mock("@/lib/api/candidate/userProfileMutations", () => ({
  useUpdateUserMutation: () => ({
    mutate: mockMutate,
    isPending: mockIsPending,
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

describe("CandidatePersonalInfoSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsPending = false;
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

  it("resets form with updated profile data when the mutation succeeds", async () => {
    const updatedProfile = {
      candidate: {
        id: "cand-1",
        user: {
          id: "user-1",
          name: "Novo Nome",
          email: "novo@exemplo.com",
          role: "CANDIDATE",
          documentType: "CNPJ",
          documentNumber: "12.345.678/0001-90",
        },
        phone: "+55 11 99999-9999",
        summary: "Novo resumo profissional",
      },
    } as CandidateProfileResponse;
    mockMutate.mockImplementation((_, options) =>
      options?.onSuccess?.(updatedProfile),
    );

    renderWithClient(
      <CandidatePersonalInfo initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    fireEvent.change(screen.getByLabelText(/Nome Completo/i), {
      target: { value: "Maria Souza" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Salvar Dados Pessoais/i }),
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Novo Nome")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("12.345.678/0001-90"),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue("+55 11 99999-9999")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("Novo resumo profissional"),
      ).toBeInTheDocument();
    });
  });

  it("shows loading state on the save button while saving", () => {
    mockIsPending = true;

    renderWithClient(
      <CandidatePersonalInfo initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    const saveBtn = screen.getByRole("button", { name: /Salvando/i });
    expect(saveBtn).toBeDisabled();
  });
});
