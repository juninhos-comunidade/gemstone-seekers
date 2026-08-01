import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CandidateJobsPage from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/candidate/dashboard/jobs",
}));

function renderWithQuery(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("Candidate Jobs Page", () => {
  it("renders the candidate jobs list page", async () => {
    renderWithQuery(<CandidateJobsPage />);
    expect(await screen.findByText("Vagas Disponíveis")).toBeInTheDocument();
    expect(
      screen.getByText("Desenvolvedor Front-end React / Next.js"),
    ).toBeInTheDocument();
  });
});
