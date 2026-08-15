import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RadarPage from "./page";

const mockUseJobsQuery = vi.fn();
const mockUseTechnologyDemand = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/candidate/dashboard/radar",
}));

vi.mock("@/lib/api/jobs/getJobs", () => ({
  useJobsQuery: () => mockUseJobsQuery(),
}));

vi.mock("@/lib/api/radar/radar", () => ({
  useTechnologyDemand: () => mockUseTechnologyDemand(),
}));

vi.mock("@/components/dashboard/radar/TopTechnologiesChart", () => ({
  TopTechnologiesChart: ({ data }: { data: Array<{ tecnologia: string }> }) => (
    <div data-testid="top-technologies-chart">
      {data.map((item) => item.tecnologia).join(", ")}
    </div>
  ),
}));

vi.mock("@/components/dashboard/radar/TechnologyRequirementChart", () => ({
  TechnologyRequirementRateChart: ({
    data,
  }: {
    data: Array<{ tecnologia: string }>;
  }) => (
    <div data-testid="technology-requirement-chart">
      {data.map((item) => item.tecnologia).join(", ")}
    </div>
  ),
}));

describe("Radar Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseJobsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    mockUseTechnologyDemand.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<RadarPage />);

    expect(
      screen.getByRole("status", { name: /loading/i }),
    ).toBeInTheDocument();
  });

  it("renders error state when api fails", () => {
    mockUseJobsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("jobs failed"),
    });
    mockUseTechnologyDemand.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });

    render(<RadarPage />);

    expect(
      screen.getByText(/não foi possível carregar os dados do radar agora/i),
    ).toBeInTheDocument();
  });

  it("renders empty state when there is no technology demand data", () => {
    mockUseJobsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    mockUseTechnologyDemand.mockReturnValue({
      data: { success: true, result: [] },
      isLoading: false,
      error: null,
    });

    render(<RadarPage />);

    expect(
      screen.getByText(/ainda não existem dados suficientes no radar/i),
    ).toBeInTheDocument();
  });

  it("renders metrics and charts with api data", () => {
    mockUseJobsQuery.mockReturnValue({
      data: [
        {
          id: "1",
          title: "Frontend Engineer",
          description: "desc",
          seniorityLevel: "Pleno",
          department: "Tecnologia",
          salaryMin: 5000,
          salaryMax: 8000,
          status: "OPEN",
          recruiterId: "r1",
          companyId: "c1",
        },
        {
          id: "2",
          title: "Backend Engineer",
          description: "desc",
          seniorityLevel: "Senior",
          department: "Tecnologia",
          salaryMin: 7000,
          salaryMax: 10000,
          status: "OPEN",
          recruiterId: "r2",
          companyId: "c2",
        },
      ],
      isLoading: false,
      error: null,
    });

    mockUseTechnologyDemand.mockReturnValue({
      data: {
        success: true,
        result: [
          {
            technologyId: 1,
            technologyName: "React",
            technologyCategory: "Frontend",
            jobCount: 10,
            mandatoryCount: 8,
          },
          {
            technologyId: 2,
            technologyName: "Node.js",
            technologyCategory: "Backend",
            jobCount: 6,
            mandatoryCount: 3,
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(<RadarPage />);

    expect(
      screen.getByRole("heading", { name: /radar do mercado/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/total de vagas/i)).toBeInTheDocument();
    expect(screen.getByText(/tecnologias monitoradas/i)).toBeInTheDocument();
    expect(screen.getByText(/tecnologia em destaque/i)).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByTestId("top-technologies-chart")).toHaveTextContent(
      "React, Node.js",
    );
    expect(
      screen.getByTestId("technology-requirement-chart"),
    ).toHaveTextContent("React, Node.js");
  });
});
