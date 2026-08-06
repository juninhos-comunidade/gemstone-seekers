import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TopTechnologiesChart } from "./TopTechnologiesChart";

const mockBarChart = vi.fn();
const mockXAxis = vi.fn();
const mockBar = vi.fn();
const mockChartTooltip = vi.fn();

vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-container">{children}</div>
  ),
  ChartLegend: () => <div data-testid="chart-legend" />,
  ChartLegendContent: () => <div data-testid="chart-legend-content" />,
  ChartTooltip: (props: Record<string, unknown>) => {
    mockChartTooltip(props);
    return <div data-testid="chart-tooltip" />;
  },
  ChartTooltipContent: () => <div data-testid="chart-tooltip-content" />,
}));

vi.mock("recharts", () => ({
  BarChart: (props: Record<string, unknown>) => {
    mockBarChart(props);
    return (
      <div data-testid="bar-chart">{props.children as React.ReactNode}</div>
    );
  },
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: (props: Record<string, unknown>) => {
    mockXAxis(props);
    return <div data-testid="x-axis" />;
  },
  Bar: (props: Record<string, unknown>) => {
    mockBar(props);
    return (
      <div data-testid="bar-series">{props.children as React.ReactNode}</div>
    );
  },
  Cell: ({ fill }: { fill: string }) => (
    <div data-fill={fill} data-testid="bar-cell" />
  ),
}));

describe("TopTechnologiesChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: "(max-width: 640px)",
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("renders heading, description and chart data", () => {
    render(
      <TopTechnologiesChart
        data={[
          { tecnologia: "React", vagas: 10, fill: "#111111" },
          { tecnologia: "Node.js", vagas: 8, fill: "#222222" },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /tecnologias com mais vagas/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/tecnologias mais demandadas por número de vagas/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("chart-container")).toBeInTheDocument();
    expect(screen.getAllByTestId("bar-cell")).toHaveLength(2);
  });

  it("renders chart with configured desktop props", () => {
    render(
      <TopTechnologiesChart
        data={[{ tecnologia: "React", vagas: 10, fill: "#111111" }]}
      />,
    );

    expect(mockBarChart).toHaveBeenCalled();
    const chartProps = mockBarChart.mock.calls[0][0];
    const xAxisProps = mockXAxis.mock.calls[0][0];
    const barProps = mockBar.mock.calls[0][0];

    expect(chartProps.margin).toEqual({
      top: 8,
      right: 8,
      left: -16,
      bottom: 0,
    });
    expect(chartProps.barCategoryGap).toBe("18%");
    expect(xAxisProps.tickFormatter("TechnologyLong")).toBe("Techno…");
    expect(xAxisProps.tickFormatter("React")).toBe("React");
    expect(barProps.barSize).toBe(18);
  });

  it("configures tooltip with cursor disabled", () => {
    render(
      <TopTechnologiesChart
        data={[{ tecnologia: "React", vagas: 10, fill: "#111111" }]}
      />,
    );

    const tooltipProps = mockChartTooltip.mock.calls[0][0];
    expect(tooltipProps.cursor).toBe(false);
  });
});
