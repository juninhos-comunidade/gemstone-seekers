import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CandidateProfileForm } from "@/components/Profile/EditForm/CandidateProfileForm";
import { INITIAL_MOCK_CANDIDATE } from "@/lib/mocks/candidateMock";
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

describe("CandidateProfileForm Component", () => {
  it("renders form fields initialized with candidate data across tabs", () => {
    renderWithQuery(
      <CandidateProfileForm initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    expect(screen.getByLabelText(/Nome Completo/i)).toHaveValue("Thiago Silva");

    const addressTab = screen.getByRole("tab", { name: /Endereço/i });
    fireEvent.click(addressTab);

    expect(screen.getByLabelText(/Logradouro \/ Rua/i)).toHaveValue(
      "Avenida Paulista",
    );
  });
});
