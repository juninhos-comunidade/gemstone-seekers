import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CandidateProfileView } from "@/components/Profile/CandidateProfileView";
import {
  INITIAL_MOCK_CANDIDATE,
  EMPTY_CANDIDATE_MOCK,
} from "@/lib/mocks/candidateMock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

function renderWithQuery(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("CandidateProfileView Component", () => {
  it("renders candidate name and email when data is provided", () => {
    renderWithQuery(
      <CandidateProfileView initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    expect(screen.getByText("Thiago Silva")).toBeInTheDocument();
    expect(
      screen.getAllByText("thiago.silva@exemplo.com")[0],
    ).toBeInTheDocument();
  });

  it("renders empty state message when candidate data is empty", () => {
    renderWithQuery(
      <CandidateProfileView initialData={EMPTY_CANDIDATE_MOCK} />,
    );

    expect(
      screen.getByText("Seu perfil ainda está incompleto"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Preencher Dados do Perfil Agora/i }),
    ).toBeInTheDocument();
  });
});
