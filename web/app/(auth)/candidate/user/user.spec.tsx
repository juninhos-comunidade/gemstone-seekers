import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CandidateUserPage from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

function renderWithQuery(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("Candidate User Profile Page", () => {
  it("should render candidate profile name and info", async () => {
    renderWithQuery(<CandidateUserPage />);

    expect(await screen.findByText("Thiago Silva")).toBeInTheDocument();
    expect(screen.getByText("Resumo Profissional")).toBeInTheDocument();
  });
});
