import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { JobList } from "@/components/Jobs/JobList";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";

describe("JobList Component", () => {
  it("renders list of jobs and titles correctly", () => {
    render(<JobList jobs={MOCK_JOBS} />);

    expect(
      screen.getByText("Desenvolvedor Front-end React / Next.js"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Engenheiro Backend Java / Spring Boot"),
    ).toBeInTheDocument();
  });
});
