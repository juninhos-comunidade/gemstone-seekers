import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { JobBasicInfoSection } from "@/components/Jobs/RecruiterJobForm/sections/JobBasicInfoSection";
import { useForm, FormProvider } from "react-hook-form";
import { JobFormData } from "@/lib/schemas/forms/jobFormSchema";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCompaniesQuery } from "@/lib/api/companies/getCompanies";
import { useCompanyRecruitersQuery } from "@/lib/api/companies/getCompanyRecruiters";

vi.mock("@/lib/api/companies/getCompanies", () => ({
  useCompaniesQuery: vi.fn(),
}));

vi.mock("@/lib/api/companies/getCompanyRecruiters", () => ({
  useCompanyRecruitersQuery: vi.fn(),
}));

function TestWrapper({
  initialValues,
}: {
  initialValues?: Partial<JobFormData>;
}) {
  const methods = useForm<JobFormData>({
    defaultValues: {
      title: "Dev Senior",
      companyId: "comp-1",
      recruiterId: "rec-1",
      department: "Engenharia",
      seniorityLevel: "Sênior",
      ...initialValues,
    },
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider {...methods}>
        <JobBasicInfoSection />
      </FormProvider>
    </QueryClientProvider>
  );
}

describe("JobBasicInfoSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders basic info inputs with data", () => {
    vi.mocked(useCompaniesQuery).mockReturnValue({
      data: [{ id: "comp-1", name: "Tech Corp" }],
      isLoading: false,
    } as ReturnType<typeof useCompaniesQuery>);

    vi.mocked(useCompanyRecruitersQuery).mockReturnValue({
      data: [{ id: "rec-1", name: "Recruiter Bob", email: "bob@tech.com" }],
      isLoading: false,
    } as ReturnType<typeof useCompanyRecruitersQuery>);

    render(<TestWrapper />);

    expect(screen.getByLabelText(/Título da Vaga \*/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Dev Senior")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Engenharia")).toBeInTheDocument();
  });

  it("shows loading state when companies are loading", () => {
    // data undefined = estado real de loading sem cache
    vi.mocked(useCompaniesQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isPending: true,
    } as ReturnType<typeof useCompaniesQuery>);

    vi.mocked(useCompanyRecruitersQuery).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as ReturnType<typeof useCompanyRecruitersQuery>);

    render(<TestWrapper initialValues={{ companyId: "" }} />);

    // O placeholder do trigger mostra o loading enquanto as empresas carregam,
    // e o trigger fica desabilitado (não permite abrir o menu).
    expect(screen.getByText("Carregando empresas...")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /empresa contratante/i }),
    ).toBeDisabled();
  });
});
