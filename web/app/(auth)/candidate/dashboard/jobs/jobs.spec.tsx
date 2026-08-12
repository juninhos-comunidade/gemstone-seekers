import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import CandidateJobsPage from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";

const mockUseJobsQuery = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/candidate/dashboard/jobs",
}));

vi.mock("@/lib/api/jobs/getJobs", () => ({
  useJobsQuery: () => mockUseJobsQuery(),
}));

function renderWithQuery(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("Candidate Jobs Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the candidate jobs list page", async () => {
    mockUseJobsQuery.mockReturnValue({
      data: MOCK_JOBS,
      isLoading: false,
      error: null,
    });

    renderWithQuery(<CandidateJobsPage />);
    expect(await screen.findByText("Vagas Disponíveis")).toBeInTheDocument();
    expect(
      screen.getByText("Desenvolvedor Front-end React / Next.js"),
    ).toBeInTheDocument();
  });

  it("renders loading indicator when isLoading is true", () => {
    mockUseJobsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    renderWithQuery(<CandidateJobsPage />);
    expect(
      screen.getByText(/Buscando oportunidades disponíveis.../i),
    ).toBeInTheDocument();
  });

  it("renders error message when query fails", () => {
    mockUseJobsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error("Error loading jobs"),
    });

    renderWithQuery(<CandidateJobsPage />);
    expect(
      screen.getByText(/Erro ao carregar lista de vagas./i),
    ).toBeInTheDocument();
  });
});
