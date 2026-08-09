import React from "react";
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

  it("filters jobs when typing in search input and allows clearing search", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();

    render(<JobList jobs={MOCK_JOBS} />);

    const searchInput = screen.getByPlaceholderText(
      /Buscar por título, tech ou empresa.../i,
    );
    await user.type(searchInput, "InexistenteQuery123");

    expect(
      screen.getByText(/Nenhuma vaga encontrada para "InexistenteQuery123"/i),
    ).toBeInTheDocument();

    const clearButton = screen.getByRole("button", { name: /Limpar busca/i });
    await user.click(clearButton);

    expect(
      screen.getByText("Desenvolvedor Front-end React / Next.js"),
    ).toBeInTheDocument();
  });

  it("renders salary range correctly", () => {
    const mockJobsExtra = [
      {
        ...MOCK_JOBS[0],
        id: "extra-1",
        salaryMin: 5000,
        salaryMax: 8000,
      },
    ];

    render(<JobList jobs={mockJobsExtra} />);
    expect(screen.getByText(/\/ mês/i)).toBeInTheDocument();
  });
});
