import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { JobDetail } from "@/components/Jobs/JobDetail";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";
import { useJobTechnologiesQuery } from "@/lib/api/jobs/jobTechnologies/getJobTechnologies";

vi.mock("@/lib/api/jobs/jobTechnologies/getJobTechnologies", () => ({
  useJobTechnologiesQuery: vi.fn(),
}));

describe("JobDetail Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders job title, salary range, and mandatory/optional technologies", () => {
    vi.mocked(useJobTechnologiesQuery).mockReturnValue({
      data: [
        {
          technologyId: 1,
          technologyName: "React",
          category: "Frontend",
          isMandatory: true,
        },
        {
          technologyId: 2,
          technologyName: "TypeScript",
          category: "Linguagens",
          isMandatory: false,
        },
      ],
      isLoading: false,
    } as ReturnType<typeof useJobTechnologiesQuery>);

    const job = {
      ...MOCK_JOBS[0],
      salaryMin: 5000,
      salaryMax: 8000,
    };
    render(<JobDetail job={job} />);

    expect(screen.getByText(job.title)).toBeInTheDocument();
    expect(screen.getByText(/Faixa Salarial Prevista/i)).toBeInTheDocument();
    expect(screen.getByText("Requisitos Obrigatórios")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Diferenciais / Desejáveis")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders loading state when technologies are loading", () => {
    vi.mocked(useJobTechnologiesQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useJobTechnologiesQuery>);

    render(<JobDetail job={MOCK_JOBS[0]} />);
    expect(screen.getByText(/Carregando tecnologias.../i)).toBeInTheDocument();
  });

  it("renders empty technologies message when tech list is empty", () => {
    vi.mocked(useJobTechnologiesQuery).mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof useJobTechnologiesQuery>);

    render(<JobDetail job={{ ...MOCK_JOBS[0], technologies: [] }} />);
    expect(
      screen.getByText(/Nenhuma tecnologia cadastrada para esta vaga./i),
    ).toBeInTheDocument();
  });
});
