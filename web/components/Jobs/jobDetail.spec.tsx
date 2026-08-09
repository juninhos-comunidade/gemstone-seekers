import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { JobDetail } from "@/components/Jobs/JobDetail";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";

vi.mock("@/lib/api/jobs/jobTechnologies/getJobTechnologies", () => ({
  useJobTechnologiesQuery: () => ({
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
  }),
}));

describe("JobDetail Component", () => {
  it("renders job title and mandatory technologies", () => {
    const job = MOCK_JOBS[0];
    render(<JobDetail job={job} />);

    expect(screen.getByText(job.title)).toBeInTheDocument();
    expect(screen.getByText("Requisitos Obrigatórios")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });
});
