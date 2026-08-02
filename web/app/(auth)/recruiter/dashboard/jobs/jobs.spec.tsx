import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RecruiterJobsPage from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function renderWithQuery(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("Recruiter Jobs Page", () => {
  it("renders the recruiter jobs dashboard page after loading", async () => {
    renderWithQuery(<RecruiterJobsPage />);

    expect(
      await screen.findByText("Gestão de Vagas & Oportunidades"),
    ).toBeInTheDocument();
  });
});
