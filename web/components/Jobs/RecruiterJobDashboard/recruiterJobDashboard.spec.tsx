import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RecruiterJobDashboard } from "@/components/Jobs/RecruiterJobDashboard/RecruiterJobDashboard";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function renderWithQuery(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("RecruiterJobDashboard Component", () => {
  it("renders job metrics, titles, and create job CTA link", () => {
    renderWithQuery(<RecruiterJobDashboard jobs={MOCK_JOBS} />);

    expect(
      screen.getByText("Gestão de Vagas & Oportunidades"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Cadastrar Nova Vaga/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Desenvolvedor Front-end React / Next.js"),
    ).toBeInTheDocument();
  });
});
