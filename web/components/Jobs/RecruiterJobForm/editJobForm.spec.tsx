import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { EditJobForm } from "@/components/Jobs/RecruiterJobForm/EditJobForm";
import { MOCK_JOBS } from "@/lib/mocks/jobMock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

const mockPush = vi.fn();
const mockMutateAsyncUpdate = vi.fn();
const mockMutateAsyncAddTechs = vi.fn();
const mockMutateAsyncRemoveTechs = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/api/jobs/updateJob", () => ({
  useUpdateJobMutation: () => ({
    mutateAsync: mockMutateAsyncUpdate,
    isPending: false,
  }),
}));

vi.mock("@/lib/api/jobs/jobTechnologies/getJobTechnologies", () => ({
  useJobTechnologiesQuery: () => ({
    data: [
      {
        technologyId: 1,
        name: "React",
        category: "Frontend",
        isMandatory: true,
      },
    ],
    isLoading: false,
  }),
}));

vi.mock("@/lib/api/jobs/jobTechnologies/addJobTechnologies", () => ({
  useAddJobTechnologiesMutation: () => ({
    mutateAsync: mockMutateAsyncAddTechs,
    isPending: false,
  }),
}));

vi.mock("@/lib/api/jobs/jobTechnologies/deleteJobTechnologies", () => ({
  useRemoveJobTechnologiesMutation: () => ({
    mutateAsync: mockMutateAsyncRemoveTechs,
    isPending: false,
  }),
}));

vi.mock("@/lib/api/companies/getCompanies", () => ({
  useCompaniesQuery: () => ({
    data: [{ id: "comp-01", name: "Tech Corp", cnpj: "12.345.678/0001-90" }],
    isLoading: false,
  }),
}));

vi.mock("@/lib/api/companies/getCompanyRecruiters", () => ({
  useCompanyRecruitersQuery: () => ({
    data: [{ id: "rec-01", companyId: "comp-01", name: "João Recrutador" }],
    isLoading: false,
  }),
}));

vi.mock("@/lib/api/technologies/getTechnologies", () => ({
  useTechnologiesQuery: () => ({
    data: [
      { id: 1, name: "React", category: "Frontend" },
      { id: 2, name: "Node.js", category: "Backend" },
    ],
    isLoading: false,
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

describe("EditJobForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders job edit form prefilled with initial job data", () => {
    renderWithQuery(<EditJobForm initialJob={MOCK_JOBS[0]} />);

    expect(screen.getByLabelText(/Título da Vaga \*/i)).toHaveValue(
      "Desenvolvedor Front-end React / Next.js",
    );
    expect(
      screen.getByRole("button", { name: /Salvar Alterações da Vaga/i }),
    ).toBeInTheDocument();
  });

  it("submits updated job data and navigates to dashboard on success", async () => {
    mockMutateAsyncUpdate.mockResolvedValueOnce({});

    renderWithQuery(<EditJobForm initialJob={MOCK_JOBS[0]} />);

    const titleInput = screen.getByLabelText(/Título da Vaga \*/i);
    fireEvent.change(titleInput, {
      target: { value: "Desenvolvedor Front-end React Lead" },
    });

    const submitButton = screen.getByRole("button", {
      name: /Salvar Alterações da Vaga/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsyncUpdate).toHaveBeenCalledWith({
        id: MOCK_JOBS[0].id,
        data: expect.objectContaining({
          title: "Desenvolvedor Front-end React Lead",
          companyId: "comp-01",
          recruiterId: "rec-01",
        }),
      });
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Vaga e requisitos atualizados com sucesso!",
    );
    expect(mockPush).toHaveBeenCalledWith("/recruiter/dashboard/jobs");
  });

  it("shows error toast when job update fails", async () => {
    mockMutateAsyncUpdate.mockRejectedValueOnce(new Error("Falha ao salvar"));

    renderWithQuery(<EditJobForm initialJob={MOCK_JOBS[0]} />);

    const titleInput = screen.getByLabelText(/Título da Vaga \*/i);
    fireEvent.change(titleInput, {
      target: { value: "Desenvolvedor Front-end React Lead" },
    });

    const submitButton = screen.getByRole("button", {
      name: /Salvar Alterações da Vaga/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsyncUpdate).toHaveBeenCalled();
    });

    expect(toast.error).toHaveBeenCalledWith("Erro ao atualizar a vaga.");
  });
});
