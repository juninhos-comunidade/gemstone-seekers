import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RecruiterJobsPage from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";
import { useJobsQuery } from "@/lib/api/jobs/getJobs";

vi.mock("@/lib/api/jobs/getJobs", () => ({
  useJobsQuery: vi.fn(),
}));

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

describe("RecruiterJobsPage (app/(auth)/recruiter/dashboard/jobs/page.tsx)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading spinner state when query is loading", () => {
    vi.mocked(useJobsQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as ReturnType<typeof useJobsQuery>);

    renderWithQuery(<RecruiterJobsPage />);

    expect(
      screen.getByText("Carregando vagas do recrutador..."),
    ).toBeInTheDocument();
  });

  it("renders error message state when query fails", () => {
    vi.mocked(useJobsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Falha na API"),
    } as ReturnType<typeof useJobsQuery>);

    renderWithQuery(<RecruiterJobsPage />);

    expect(
      screen.getByText("Erro ao carregar painel de vagas."),
    ).toBeInTheDocument();
  });

  it("renders RecruiterJobDashboard when query successfully returns jobs data", () => {
    vi.mocked(useJobsQuery).mockReturnValue({
      data: MOCK_JOBS,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useJobsQuery>);

    renderWithQuery(<RecruiterJobsPage />);

    expect(
      screen.getByRole("heading", {
        name: /Gestão de Vagas & Oportunidades/i,
      }),
    ).toBeInTheDocument();
  });
});
