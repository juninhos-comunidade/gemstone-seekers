import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EditJobPage from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useJobDetailQuery } from "@/lib/api/jobs/getJobDetail";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";

vi.mock("@/lib/api/jobs/getJobDetail", () => ({
  useJobDetailQuery: vi.fn(),
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

describe("EditJobPage (app/(auth)/recruiter/dashboard/jobs/[id]/edit/page.tsx)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading spinner state when job detail is loading", async () => {
    vi.mocked(useJobDetailQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useJobDetailQuery>);

    const mockParams = Promise.resolve({ id: "job-123" });
    await act(async () => {
      renderWithQuery(<EditJobPage params={mockParams} />);
    });

    expect(
      screen.getByText("Carregando dados da vaga para edição..."),
    ).toBeInTheDocument();
  });

  it("renders empty state 'Vaga não encontrada' when job is not found", async () => {
    vi.mocked(useJobDetailQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as ReturnType<typeof useJobDetailQuery>);

    const mockParams = Promise.resolve({ id: "job-123" });
    await act(async () => {
      renderWithQuery(<EditJobPage params={mockParams} />);
    });

    expect(screen.getByText("Vaga não encontrada")).toBeInTheDocument();
    const backLink = screen.getByRole("link", {
      name: /Voltar para Lista de Vagas/i,
    });
    expect(backLink).toHaveAttribute("href", "/recruiter/dashboard/jobs");
  });

  it("renders EditJobForm when job data is loaded successfully", async () => {
    vi.mocked(useJobDetailQuery).mockReturnValue({
      data: MOCK_JOBS[0],
      isLoading: false,
    } as ReturnType<typeof useJobDetailQuery>);

    const mockParams = Promise.resolve({ id: "job-123" });
    await act(async () => {
      renderWithQuery(<EditJobPage params={mockParams} />);
    });

    expect(
      screen.getByRole("heading", {
        name: /Editar Oportunidade de Trabalho/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Salvar Alterações da Vaga/i }),
    ).toBeInTheDocument();
  });
});
