import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CandidateProfileForm } from "./CandidateProfileForm";

vi.mock("@/lib/api/candidate/userProfileMutations", () => ({
  useUpdateUserMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useUpdateAddressMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useAddLinkMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteLinkMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useAddExperienceMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteExperienceMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useAddEducationMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteEducationMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useAddCertificationMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteCertificationMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useAddLanguageMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteLanguageMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useAddProjectMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteProjectMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("@/lib/api/location/location", () => ({
  useCountriesQuery: () => ({ data: [], isLoading: false }),
  useStatesQuery: () => ({ data: [], isLoading: false }),
  useStatesByCountryQuery: () => ({ data: [], isLoading: false }),
  useCitiesByStateQuery: () => ({ data: [], isLoading: false }),
}));

vi.mock("@/lib/api/languages/languages", () => ({
  useLanguagesQuery: () => ({ data: [], isLoading: false }),
}));

function renderWithClient(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("CandidateProfileForm Component", () => {
  it("renders main heading, navigation link and default personal tab content", () => {
    renderWithClient(<CandidateProfileForm initialData={null} />);
    expect(screen.getByText(/Editar Perfil do Candidato/i)).toBeInTheDocument();
    expect(screen.getByText(/Voltar para o Perfil/i)).toBeInTheDocument();
    expect(screen.getByText(/Informações Pessoais/i)).toBeInTheDocument();
  });

  it("renders all tab options in the sidebar", () => {
    renderWithClient(<CandidateProfileForm initialData={null} />);

    expect(
      screen.getByRole("tab", { name: /Dados Pessoais/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Endereço/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Links & Redes/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Idiomas/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Experiência/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Educação/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Certificações/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Projetos/i })).toBeInTheDocument();
  });
});
