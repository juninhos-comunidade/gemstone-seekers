import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CandidateAddress } from "./CandidateAddress";
import { CandidateProfileResponse } from "@/lib/types/candidate";

const mockMutate = vi.fn();

vi.mock("@/lib/api/candidate/userProfileMutations", () => ({
  useUpdateAddressMutation: () => ({ mutate: mockMutate, isPending: false }),
}));

vi.mock("@/lib/api/location/location", () => ({
  useCountriesQuery: () => ({
    data: [
      { id: 1, name: "Brazil" },
      { id: 2, name: "Argentina" },
    ],
    isLoading: false,
  }),
  useStatesQuery: () => ({
    data: [
      { id: 10, name: "São Paulo", countryId: 1 },
      { id: 20, name: "Rio de Janeiro", countryId: 1 },
    ],
    isLoading: false,
  }),
  useStatesByCountryQuery: () => ({
    data: [
      { id: 10, name: "São Paulo", countryId: 1 },
      { id: 20, name: "Rio de Janeiro", countryId: 1 },
    ],
    isLoading: false,
  }),
  useCitiesByStateQuery: () => ({
    data: [
      { id: 100, name: "Campinas" },
      { id: 200, name: "São Paulo" },
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

describe("CandidateAddress Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProfileWithAddress: CandidateProfileResponse = {
    candidate: {
      id: "cand-1",
      user: {
        id: "u-1",
        name: "User",
        email: "user@example.com",
        role: "CANDIDATE",
      },
    },
    address: {
      id: "addr-1",
      street: "Rua das Flores",
      number: "123",
      neighborhood: "Centro",
      complement: "Apto 45",
      zipCode: "13000-000",
      city: {
        id: 100,
        name: "Campinas",
        stateId: 10,
        stateName: "São Paulo",
        countryName: "Brazil",
      },
    },
  };

  it("renders address section correctly with initial data", () => {
    renderWithClient(<CandidateAddress initialData={mockProfileWithAddress} />);
    expect(screen.getByText(/Endereço Residencial/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Rua das Flores")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Centro")).toBeInTheDocument();
    expect(screen.getByDisplayValue("13000-000")).toBeInTheDocument();
  });

  it("resolves initial location when stateName and countryName match without ids", () => {
    const profileWithoutIds: CandidateProfileResponse = {
      ...mockProfileWithAddress,
      address: {
        ...mockProfileWithAddress.address!,
        city: {
          name: "Campinas",
          stateName: "São Paulo",
          countryName: "Brazil",
        },
      },
    };
    renderWithClient(<CandidateAddress initialData={profileWithoutIds} />);
    expect(screen.getByDisplayValue("Rua das Flores")).toBeInTheDocument();
  });

  it("renders form with empty initial values when initialData is null or address is missing", () => {
    renderWithClient(<CandidateAddress initialData={null} />);
    expect(screen.getByText(/Endereço Residencial/i)).toBeInTheDocument();
  });

  it("submits address form when inputs are filled and valid", async () => {
    renderWithClient(<CandidateAddress initialData={null} />);

    fireEvent.change(screen.getByLabelText(/Logradouro \/ Rua/i), {
      target: { value: "Avenida Paulista" },
    });
    fireEvent.change(screen.getByLabelText(/Número/i), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByLabelText(/Bairro/i), {
      target: { value: "Bela Vista" },
    });
    fireEvent.change(screen.getByLabelText(/CEP/i), {
      target: { value: "01310-100" },
    });

    const submitBtn = screen.getByRole("button", {
      name: /Salvar Endereço/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          street: "Avenida Paulista",
          number: "1000",
          neighborhood: "Bela Vista",
          zipCode: "01310-100",
        }),
      );
    });
  });

  it("submits form with empty string fields when submitting without filling", async () => {
    renderWithClient(<CandidateAddress initialData={null} />);

    const submitBtn = screen.getByRole("button", {
      name: /Salvar Endereço/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          street: "",
          number: "",
          neighborhood: "",
        }),
      );
    });
  });
});
