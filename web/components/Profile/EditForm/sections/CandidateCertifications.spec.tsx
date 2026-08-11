import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CandidateCertifications } from "./CandidateCertifications";
import { INITIAL_MOCK_CANDIDATE } from "@/lib/mocks/candidateMock";
import { CandidateProfileResponse } from "@/lib/types/candidate";

const mockAddMutate = vi.fn();
const mockDeleteMutate = vi.fn();

vi.mock("@/lib/api/candidate/userProfileMutations", () => ({
  useAddCertificationMutation: () => ({
    mutate: mockAddMutate,
    isPending: false,
  }),
  useDeleteCertificationMutation: () => ({
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

describe("CandidateCertificationsSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders certifications section correctly", () => {
    renderWithClient(
      <CandidateCertifications initialData={INITIAL_MOCK_CANDIDATE} />,
    );
    expect(screen.getByText(/Certificações & Licenças/i)).toBeInTheDocument();
  });

  it("adds a certification when form is submitted", async () => {
    mockAddMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    });

    renderWithClient(
      <CandidateCertifications initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    fireEvent.change(
      screen.getByPlaceholderText(/Ex: AWS Certified Solutions Architect/i),
      { target: { value: "CKA" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText(/Ex: Amazon Web Services, Google/i),
      { target: { value: "CNCF" } },
    );

    const addBtn = screen.getByRole("button", {
      name: /Adicionar Certificação/i,
    });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(mockAddMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "CKA",
          issuingOrganization: "CNCF",
        }),
        expect.any(Object),
      );
    });
  });

  it("displays validation errors on empty submission", async () => {
    renderWithClient(<CandidateCertifications initialData={null} />);

    const addBtn = screen.getByRole("button", {
      name: /Adicionar Certificação/i,
    });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Nome da certificação obrigatório/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Emissor obrigatório/i)).toBeInTheDocument();
    });
  });

  it("deletes a certification on confirm", async () => {
    mockDeleteMutate.mockImplementation((data, options) => {
      if (options?.onSuccess) options.onSuccess();
      if (options?.onError) options.onError(new Error("Err"));
    });

    renderWithClient(
      <CandidateCertifications initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    const deleteBtns = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteBtns[0]);

    expect(screen.getByText(/Remover Certificação/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", {
      name: /Confirmar Exclusão/i,
    });
    fireEvent.click(confirmBtn);

    expect(mockDeleteMutate).toHaveBeenCalled();
  });

  it("handles delete when certification item id is empty", async () => {
    const mockDataNoId: CandidateProfileResponse = {
      ...INITIAL_MOCK_CANDIDATE,
      candidate: {
        ...INITIAL_MOCK_CANDIDATE.candidate,
        certifications: [
          {
            id: "",
            name: "Cert",
            issuingOrganization: "Org",
          },
        ],
      },
    };

    renderWithClient(<CandidateCertifications initialData={mockDataNoId} />);

    const deleteBtns = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteBtns[0]);

    const confirmBtn = screen.getByRole("button", {
      name: /Confirmar Exclusão/i,
    });
    fireEvent.click(confirmBtn);

    expect(mockDeleteMutate).not.toHaveBeenCalled();
  });
});
