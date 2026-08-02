import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RecruiterJobForm } from "@/components/Jobs/RecruiterJobForm/RecruiterJobForm";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";
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

describe("RecruiterJobForm Component", () => {
  it("renders job creation form with basic info fields and submit button", () => {
    renderWithQuery(<RecruiterJobForm />);

    expect(screen.getByLabelText(/Título da Vaga \*/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Cadastrar e Publicar Vaga/i }),
    ).toBeInTheDocument();
  });

  it("renders job edit form prefilled with initial job data", () => {
    renderWithQuery(<RecruiterJobForm initialJob={MOCK_JOBS[0]} />);

    expect(screen.getByLabelText(/Título da Vaga \*/i)).toHaveValue(
      "Desenvolvedor Front-end React / Next.js",
    );
    expect(
      screen.getByRole("button", { name: /Salvar Alterações da Vaga/i }),
    ).toBeInTheDocument();
  });
});
