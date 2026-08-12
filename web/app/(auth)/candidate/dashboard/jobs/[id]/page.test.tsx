import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import JobDetailPage from "./page";

const mockUseJobDetailQuery = vi.fn();

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    use: (param: unknown) => {
      if (param && typeof param === "object" && "id" in param) return param;
      return { id: "1" };
    },
  };
});

vi.mock("@/lib/api/jobs/getJobDetail", () => ({
  useJobDetailQuery: (id: string) => mockUseJobDetailQuery(id),
}));

vi.mock("@/components/Jobs/JobDetail", () => ({
  JobDetail: ({ job }: { job: { title: string } }) => (
    <div data-testid="job-detail-comp">Job: {job.title}</div>
  ),
}));

describe("JobDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading spinner while loading job details", () => {
    mockUseJobDetailQuery.mockReturnValue({ data: undefined, isLoading: true });

    render(
      <JobDetailPage
        params={{ id: "1" } as unknown as Promise<{ id: string }>}
      />,
    );

    expect(
      screen.getByText(/Carregando detalhes da vaga.../i),
    ).toBeInTheDocument();
  });

  it("renders job not found card when job is null", () => {
    mockUseJobDetailQuery.mockReturnValue({ data: null, isLoading: false });

    render(
      <JobDetailPage
        params={{ id: "99" } as unknown as Promise<{ id: string }>}
      />,
    );

    expect(screen.getByText(/Vaga não encontrada/i)).toBeInTheDocument();
    expect(screen.getByText(/Voltar para lista de vagas/i)).toBeInTheDocument();
  });

  it("renders JobDetail component when job is found", () => {
    mockUseJobDetailQuery.mockReturnValue({
      data: { id: "1", title: "Desenvolvedor React" },
      isLoading: false,
    });

    render(
      <JobDetailPage
        params={{ id: "1" } as unknown as Promise<{ id: string }>}
      />,
    );

    expect(screen.getByTestId("job-detail-comp")).toBeInTheDocument();
    expect(screen.getByText(/Desenvolvedor React/i)).toBeInTheDocument();
  });
});
