import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RecruiterJobDashboard } from "@/components/Jobs/RecruiterJobDashboard/RecruiterJobDashboard";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockMutateDelete = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/lib/api/jobs/deleteJob", () => ({
  useDeleteJobMutation: () => ({
    mutate: mockMutateDelete,
    isPending: false,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function renderWithQuery(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("RecruiterJobDashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders job metrics, titles, and create job CTA link", () => {
    renderWithQuery(<RecruiterJobDashboard jobs={MOCK_JOBS} />);

    expect(
      screen.getByRole("heading", {
        name: /Gestão de Vagas & Oportunidades/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Cadastrar Nova Vaga/i }),
    ).toHaveAttribute("href", "/recruiter/dashboard/jobs/new");
    expect(
      screen.getByText("Desenvolvedor Front-end React / Next.js"),
    ).toBeInTheDocument();
  });

  it("filters job cards based on search input and shows empty state when no matches found", () => {
    renderWithQuery(<RecruiterJobDashboard jobs={MOCK_JOBS} />);

    const searchInput = screen.getByPlaceholderText(
      /Buscar por título ou área.../i,
    );

    fireEvent.change(searchInput, {
      target: { value: "Front-end" },
    });

    expect(
      screen.getByText("Desenvolvedor Front-end React / Next.js"),
    ).toBeInTheDocument();

    fireEvent.change(searchInput, {
      target: { value: "TermoInexistente999" },
    });

    expect(
      screen.getByText("Nenhuma vaga encontrada para os filtros selecionados."),
    ).toBeInTheDocument();

    const clearButton = screen.getByRole("button", { name: /Limpar Filtros/i });
    fireEvent.click(clearButton);

    expect(
      screen.getByText("Desenvolvedor Front-end React / Next.js"),
    ).toBeInTheDocument();
  });

  it("filters job cards when status tabs are clicked", () => {
    renderWithQuery(<RecruiterJobDashboard jobs={MOCK_JOBS} />);

    const openTab = screen.getByRole("tab", { name: /Abertas/i });
    fireEvent.click(openTab);

    expect(
      screen.getByText("Desenvolvedor Front-end React / Next.js"),
    ).toBeInTheDocument();

    const closedTab = screen.getByRole("tab", {
      name: /Encerradas \/ Canceladas/i,
    });
    fireEvent.click(closedTab);

    expect(openTab).toBeInTheDocument();
  });

  it("opens delete confirmation dialog and handles delete success and error callbacks", async () => {
    mockMutateDelete.mockImplementation(
      (
        id: string,
        options?: { onSuccess?: () => void; onError?: () => void },
      ) => {
        options?.onSuccess?.();
        options?.onError?.();
      },
    );

    renderWithQuery(<RecruiterJobDashboard jobs={[MOCK_JOBS[0]]} />);

    const deleteButton = screen.getByRole("button", { name: /Excluir Vaga/i });
    fireEvent.click(deleteButton);

    expect(await screen.findByText("Excluir Oportunidade")).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelButton);

    fireEvent.click(deleteButton);
    const confirmButton = screen.getByRole("button", {
      name: /Confirmar Exclusão/i,
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockMutateDelete).toHaveBeenCalledWith(
        MOCK_JOBS[0].id,
        expect.anything(),
      );
    });
  });

  it("renders status badges and salary formats for various job statuses", () => {
    const cancelledJob = {
      ...MOCK_JOBS[0],
      id: "job-cancelled",
      status: "CANCELLED" as const,
      salaryMin: 5000,
      salaryMax: undefined,
    };
    const closedJob = {
      ...MOCK_JOBS[0],
      id: "job-closed",
      status: "CLOSED" as const,
      salaryMin: undefined,
      salaryMax: 10000,
    };
    const unknownStatusJob = {
      ...MOCK_JOBS[0],
      id: "job-unknown",
      status: "CANCELLED" as const,
      salaryMin: undefined,
      salaryMax: undefined,
    };

    renderWithQuery(
      <RecruiterJobDashboard
        jobs={[cancelledJob, closedJob, unknownStatusJob]}
      />,
    );

    expect(screen.getAllByText("Cancelada").length).toBeGreaterThan(1);
    expect(screen.getByText("Encerrada")).toBeInTheDocument();
  });
});
