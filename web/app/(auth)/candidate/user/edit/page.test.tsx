import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CandidateProfileEditPage from "./page";

const mockUseCandidateQuery = vi.fn();

vi.mock("@/lib/api/candidate/getCandidateProfile", () => ({
  useCandidateQuery: () => mockUseCandidateQuery(),
}));

vi.mock("@/components/Profile/EditForm/CandidateProfileForm", () => ({
  CandidateProfileForm: ({ initialData }: { initialData: unknown }) => (
    <div data-testid="candidate-profile-form">
      Mocked Form: {JSON.stringify(initialData ?? {})}
    </div>
  ),
}));

describe("CandidateProfileEditPage", () => {
  it("renders loader while loading candidate profile", () => {
    mockUseCandidateQuery.mockReturnValue({ data: undefined, isLoading: true });

    render(<CandidateProfileEditPage />);

    expect(
      screen.getByText(/Carregando formulário de edição.../i),
    ).toBeInTheDocument();
  });

  it("renders CandidateProfileForm when loading is completed", () => {
    mockUseCandidateQuery.mockReturnValue({
      data: { phone: "11999999999" },
      isLoading: false,
    });

    render(<CandidateProfileEditPage />);

    expect(screen.getByTestId("candidate-profile-form")).toBeInTheDocument();
    expect(screen.getByText(/11999999999/i)).toBeInTheDocument();
  });
});
