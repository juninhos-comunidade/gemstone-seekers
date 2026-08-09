import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { JobTechnologiesSection } from "@/components/Jobs/RecruiterJobForm/sections/JobTechnologiesSection";
import { useForm, FormProvider } from "react-hook-form";
import { JobFormData } from "@/lib/schemas/forms/jobFormSchema";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/api/technologies/getTechnologies", () => ({
  useTechnologiesQuery: () => ({
    data: [
      { id: 1, name: "React", category: "Frontend" },
      { id: 2, name: "Node.js", category: "Backend" },
      { id: 3, name: "TypeScript", category: "Linguagens" },
    ],
    isLoading: false,
  }),
}));

function TestWrapper({
  initialTechnologies = [],
}: {
  initialTechnologies?: JobFormData["technologies"];
}) {
  const methods = useForm<JobFormData>({
    defaultValues: {
      technologies: initialTechnologies,
    },
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <FormProvider {...methods}>
        <JobTechnologiesSection />
      </FormProvider>
    </QueryClientProvider>
  );
}

describe("JobTechnologiesSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state message when no technologies are selected", () => {
    render(<TestWrapper initialTechnologies={[]} />);

    expect(
      screen.getByText(/Nenhuma tecnologia selecionada ainda/i),
    ).toBeInTheDocument();
  });

  it("filters catalog technologies based on search term", () => {
    render(<TestWrapper initialTechnologies={[]} />);

    const searchInput = screen.getByPlaceholderText(/Buscar tecnologia.../i);
    fireEvent.change(searchInput, { target: { value: "Node" } });

    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.queryByText("React")).not.toBeInTheDocument();
  });

  it("adds technology when clicked in catalog and toggles mandatory status", () => {
    render(<TestWrapper initialTechnologies={[]} />);

    const reactBadge = screen.getByText("React");
    fireEvent.click(reactBadge);

    const mandatoryButton = screen.getByRole("button", {
      name: /Obrigatória/i,
    });
    expect(mandatoryButton).toBeInTheDocument();

    fireEvent.click(mandatoryButton);

    expect(
      screen.getByRole("button", { name: /Diferencial/i }),
    ).toBeInTheDocument();
  });

  it("removes technology when delete button is clicked", () => {
    render(
      <TestWrapper
        initialTechnologies={[
          {
            technologyId: 1,
            technologyName: "React",
            category: "Frontend",
            isMandatory: true,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("button", { name: /Obrigatória/i }),
    ).toBeInTheDocument();

    const removeButtons = screen.getAllByRole("button");
    const trashButton = removeButtons.find((btn) =>
      btn.className.includes("hover:text-destructive"),
    );

    if (trashButton) {
      fireEvent.click(trashButton);
    }

    expect(
      screen.getByText(/Nenhuma tecnologia selecionada ainda/i),
    ).toBeInTheDocument();
  });
});
