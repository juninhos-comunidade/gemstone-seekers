import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateJobForm } from "@/components/Jobs/RecruiterJobForm/CreateJobForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

const mockPush = vi.fn();
const mockMutateAsyncCreate = vi.fn();
const mockMutateAsyncAddTechs = vi.fn();

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

vi.mock("@/lib/api/jobs/createJob", () => ({
  useCreateJobMutation: () => ({
    mutateAsync: mockMutateAsyncCreate,
    isPending: false,
  }),
}));

vi.mock("@/lib/api/jobs/jobTechnologies/addJobTechnologies", () => ({
  useAddJobTechnologiesMutation: () => ({
    mutateAsync: mockMutateAsyncAddTechs,
    isPending: false,
  }),
}));

vi.mock("@/lib/api/companies/getCompanies", () => ({
  useCompaniesQuery: () => ({
    data: [{ id: "comp-1", name: "Tech Corp", cnpj: "12.345.678/0001-90" }],
    isLoading: false,
  }),
}));

vi.mock("@/lib/api/companies/getCompanyRecruiters", () => ({
  useCompanyRecruitersQuery: (companyId: string) => ({
    data: companyId
      ? [{ id: "rec-1", companyId: "comp-1", name: "João Recrutador" }]
      : [],
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

describe("CreateJobForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form sections, header, inputs and action buttons", () => {
    renderWithQuery(<CreateJobForm />);

    expect(
      screen.getByRole("heading", { name: /Cadastrar Nova Oportunidade/i }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/Título da Vaga \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descrição da Vaga \*/i)).toBeInTheDocument();

    const backLink = screen.getByRole("link", { name: /Voltar para Vagas/i });
    expect(backLink).toHaveAttribute("href", "/recruiter/dashboard/jobs");

    expect(
      screen.getByRole("button", { name: /Cadastrar e Publicar Vaga/i }),
    ).toBeInTheDocument();
  });

  it("submits job data and technologies when form is filled and submitted", async () => {
    mockMutateAsyncCreate.mockResolvedValueOnce({
      id: "job-123",
      title: "Dev React",
    });
    mockMutateAsyncAddTechs.mockResolvedValueOnce({});

    renderWithQuery(<CreateJobForm />);

    // Fill title & description
    const titleInput = screen.getByLabelText(/Título da Vaga \*/i);
    fireEvent.change(titleInput, {
      target: { value: "Desenvolvedor React Sr" },
    });

    const descriptionInput = screen.getByLabelText(/Descrição da Vaga \*/i);
    fireEvent.change(descriptionInput, {
      target: {
        value:
          "Desenvolver aplicações web modernas em Next.js com alto padrão.",
      },
    });

    // Select Company & Recruiter
    const companySelect = screen.getByLabelText(/Empresa Contratante \*/i);
    fireEvent.click(companySelect);
    const companyOption = await screen.findByText("Tech Corp");
    fireEvent.click(companyOption);

    const recruiterSelect = screen.getByLabelText(/Recrutador Responsável \*/i);
    fireEvent.click(recruiterSelect);
    const recruiterOption = await screen.findByText("João Recrutador");
    fireEvent.click(recruiterOption);

    const submitButton = screen.getByRole("button", {
      name: /Cadastrar e Publicar Vaga/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsyncCreate).toHaveBeenCalled();
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Vaga cadastrada e publicada com sucesso!",
    );
    expect(mockPush).toHaveBeenCalledWith("/recruiter/dashboard/jobs");
  });

  it("shows error toast when job creation fails", async () => {
    mockMutateAsyncCreate.mockRejectedValueOnce(new Error("Erro de rede"));

    renderWithQuery(<CreateJobForm />);

    const titleInput = screen.getByLabelText(/Título da Vaga \*/i);
    fireEvent.change(titleInput, {
      target: { value: "Desenvolvedor React Sr" },
    });

    const descriptionInput = screen.getByLabelText(/Descrição da Vaga \*/i);
    fireEvent.change(descriptionInput, {
      target: {
        value:
          "Desenvolver aplicações web modernas em Next.js com alto padrão.",
      },
    });

    // Select Company & Recruiter
    const companySelect = screen.getByLabelText(/Empresa Contratante \*/i);
    fireEvent.click(companySelect);
    const companyOption = await screen.findByText("Tech Corp");
    fireEvent.click(companyOption);

    const recruiterSelect = screen.getByLabelText(/Recrutador Responsável \*/i);
    fireEvent.click(recruiterSelect);
    const recruiterOption = await screen.findByText("João Recrutador");
    fireEvent.click(recruiterOption);

    const submitButton = screen.getByRole("button", {
      name: /Cadastrar e Publicar Vaga/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsyncCreate).toHaveBeenCalled();
    });

    expect(toast.error).toHaveBeenCalledWith("Erro ao cadastrar a vaga.");
  });
});
