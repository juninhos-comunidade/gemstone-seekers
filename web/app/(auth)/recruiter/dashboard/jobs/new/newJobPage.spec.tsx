import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NewJobPage from "./page";
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

describe("NewJobPage (app/(auth)/recruiter/dashboard/jobs/new/page.tsx)", () => {
  it("renders the CreateJobForm inside the page container", () => {
    renderWithQuery(<NewJobPage />);

    expect(
      screen.getByRole("heading", { name: /Cadastrar Nova Oportunidade/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Cadastrar e Publicar Vaga/i }),
    ).toBeInTheDocument();
  });
});
