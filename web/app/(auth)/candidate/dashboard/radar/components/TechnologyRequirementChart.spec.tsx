import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TechnologyRequirementRateChart } from "./TechnologyRequirementChart";

const mockBarChart = vi.fn();
const mockXAxis = vi.fn();
const mockYAxis = vi.fn();
const mockBar = vi.fn();
const mockChartTooltip = vi.fn();

let mediaQueryListener: ((_event: { matches: boolean }) => void) | null = null;

vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-container">{children}</div>
  ),
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
  YAxis: (props: Record<string, unknown>) => {
    mockYAxis(props);
    return <div data-testid="y-axis" />;
  },
  Bar: (props: Record<string, unknown>) => {
    mockBar(props);
    return <div data-testid="bar-series" />;
  },
}));

describe("TechnologyRequirementRateChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mediaQueryListener = null;

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: "(max-width: 640px)",
        onchange: null,
        addEventListener: vi.fn(
          (_: string, listener: (_event: { matches: boolean }) => void) => {
            mediaQueryListener = listener;
          },
        ),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("renders heading, description and chart container", () => {
    render(
      <TechnologyRequirementRateChart
        data={[{ tecnologia: "React", percentual: 80, fill: "#111111" }]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /proporção de obrigatoriedade/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/percentual de vagas em que cada tecnologia/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("chart-container")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("renders chart with configured desktop props", () => {
    render(
      <TechnologyRequirementRateChart
        data={[{ tecnologia: "React", percentual: 80, fill: "#111111" }]}
      />,
    );

    expect(mockBarChart).toHaveBeenCalled();
    const chartProps = mockBarChart.mock.calls[0][0];
    const xAxisProps = mockXAxis.mock.calls[0][0];
    const yAxisProps = mockYAxis.mock.calls[0][0];
    const barProps = mockBar.mock.calls[0][0];

    expect(chartProps.layout).toBe("vertical");
    expect(chartProps.margin).toEqual({ top: 4, right: 8, left: 0, bottom: 4 });
    expect(chartProps.barCategoryGap).toBe("18%");

    expect(xAxisProps.type).toBe("number");
    expect(xAxisProps.domain).toEqual([0, 100]);
    expect(xAxisProps.tickFormatter(25)).toBe("25%");

    expect(yAxisProps.width).toBe(64);
    expect(yAxisProps.tickFormatter("TechnologyLong")).toBe("Technolo…");
    expect(yAxisProps.tickFormatter("React")).toBe("React");

    expect(barProps.dataKey).toBe("percentual");
    expect(barProps.barSize).toBe(14);
    expect(barProps.fill).toBe("#3b82f6");
  });

  it("updates to mobile props when media query changes", () => {
    render(
      <TechnologyRequirementRateChart
        data={[{ tecnologia: "ReactNative", percentual: 80, fill: "#111111" }]}
      />,
    );

    act(() => {
      mediaQueryListener?.({ matches: true });
    });

    const lastChartProps = mockBarChart.mock.calls.at(-1)?.[0];
    const lastYAxisProps = mockYAxis.mock.calls.at(-1)?.[0];
    const lastBarProps = mockBar.mock.calls.at(-1)?.[0];

    expect(lastChartProps.margin).toEqual({
      top: 2,
      right: 4,
      left: 0,
      bottom: 2,
    });
    expect(lastChartProps.barCategoryGap).toBe("12%");
    expect(lastYAxisProps.width).toBe(52);
    expect(lastYAxisProps.tickFormatter("ReactNative")).toBe("ReactN…");
    expect(lastBarProps.barSize).toBe(10);
  });

  it("configures tooltip with cursor disabled", () => {
    render(
      <TechnologyRequirementRateChart
        data={[{ tecnologia: "React", percentual: 80, fill: "#111111" }]}
      />,
    );

    const tooltipProps = mockChartTooltip.mock.calls[0][0];
    expect(tooltipProps.cursor).toBe(false);
  });
});
