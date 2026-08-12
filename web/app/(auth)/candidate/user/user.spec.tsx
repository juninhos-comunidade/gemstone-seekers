import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CandidateUserPage from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockUseCandidateQuery = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/lib/api/candidate/getCandidateProfile", () => ({
  useCandidateQuery: () => mockUseCandidateQuery(),
}));

function renderWithQuery(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("Candidate User Profile Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render candidate profile name and info", async () => {
    mockUseCandidateQuery.mockReturnValue({
      data: {
        candidate: {
          id: "1",
          phone: "11999999999",
          summary: "Resumo Profissional",
          user: { name: "Thiago Silva", email: "thiago@example.com" },
        },
        address: null,
      },
      isLoading: false,
      error: null,
    });

    renderWithQuery(<CandidateUserPage />);

    expect(await screen.findByText("Thiago Silva")).toBeInTheDocument();
    expect(screen.getAllByText("Resumo Profissional")[0]).toBeInTheDocument();
  });

  it("should render loading spinner when isLoading is true", () => {
    mockUseCandidateQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    renderWithQuery(<CandidateUserPage />);
    expect(
      screen.getByText(/Carregando dados do candidato.../i),
    ).toBeInTheDocument();
  });

  it("should render error message when query fails", () => {
    mockUseCandidateQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed"),
    });

    renderWithQuery(<CandidateUserPage />);
    expect(
      screen.getByText(/Erro ao carregar dados do candidato./i),
    ).toBeInTheDocument();
  });
});
