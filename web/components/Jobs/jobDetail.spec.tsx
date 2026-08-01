import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { JobDetail } from "@/components/Jobs/JobDetail";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";

describe("JobDetail Component", () => {
  it("renders job title, company name and mandatory technologies", () => {
    const job = MOCK_JOBS[0];
    render(<JobDetail job={job} />);

    expect(screen.getByText(job.title)).toBeInTheDocument();
    expect(screen.getByText(job.companyName)).toBeInTheDocument();
    expect(screen.getByText("Requisitos Obrigatórios")).toBeInTheDocument();
  });
});
