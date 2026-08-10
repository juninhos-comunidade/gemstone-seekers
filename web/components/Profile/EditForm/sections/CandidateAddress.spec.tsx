import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CandidateAddress } from "./CandidateAddress";
import { INITIAL_MOCK_CANDIDATE } from "@/lib/mocks/candidateMock";
import { CandidateProfileResponse } from "@/lib/types/candidate";

const mockMutate = vi.fn();

vi.mock("@/lib/api/candidate/userProfileMutations", () => ({
  useUpdateAddressMutation: () => ({ mutate: mockMutate, isPending: false }),
}));

function renderWithClient(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("CandidateAddressSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders address section correctly", () => {
    renderWithClient(<CandidateAddress initialData={INITIAL_MOCK_CANDIDATE} />);
    expect(screen.getByText(/Endereço Residencial/i)).toBeInTheDocument();
  });

  it("submits address form with values and handles onSuccess", async () => {
    mockMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) {
        options.onSuccess(INITIAL_MOCK_CANDIDATE);
      }
    });

    renderWithClient(<CandidateAddress initialData={INITIAL_MOCK_CANDIDATE} />);

    const streetInput = screen.getByLabelText(/Logradouro \/ Rua/i);
    fireEvent.change(streetInput, { target: { value: "Rua Augusta" } });

    const submitBtn = screen.getByRole("button", {
      name: /Salvar Endereço/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          street: "Rua Augusta",
        }),
        expect.any(Object),
      );
    });
  });

  it("updates form values when initialData changes", () => {
    const { rerender } = renderWithClient(
      <CandidateAddress initialData={null} />,
    );

    const newMock: CandidateProfileResponse = {
      ...INITIAL_MOCK_CANDIDATE,
      address: {
        id: "addr-1",
        street: "Nova Rua",
        number: "123",
        neighborhood: "Centro",
        complement: "",
        zipCode: "01000-000",
        city: {
          id: 1,
          name: "Campinas",
          stateId: 1,
          stateName: "SP",
          stateCode: "SP",
          countryName: "Brasil",
        },
      },
    };

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <CandidateAddress initialData={newMock} />
      </QueryClientProvider>,
    );

    expect(screen.getByDisplayValue("Nova Rua")).toBeInTheDocument();
  });
});
