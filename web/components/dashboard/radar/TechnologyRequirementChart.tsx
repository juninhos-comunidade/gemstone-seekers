"use client";

import { useSyncExternalStore } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type RequirementRateItem = {
  tecnologia: string;
  percentual: number;
  fill: string;
};

type TechnologyRequirementRateChartProps = {
  data: RequirementRateItem[];
};

const chartConfig = {
  percentual: {
    label: "Obrigatoriedade",
  },
};

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia("(max-width: 640px)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(max-width: 640px)").matches;
}

function getServerSnapshot() {
  return false;
}

export function TechnologyRequirementRateChart({
  data,
}: TechnologyRequirementRateChartProps) {
  const isMobile = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <section className="bg-card overflow-hidden rounded-2xl border p-4 shadow-sm sm:p-5 md:p-6">
      <div className="mb-4">
        <h2 className="text-foreground text-base font-semibold sm:text-lg">
          Proporção de obrigatoriedade
        </h2>

        <p className="text-muted-foreground text-xs sm:text-sm">
          Percentual de vagas em que cada tecnologia é considerada obrigatória.
        </p>
      </div>

      <ChartContainer
        config={chartConfig}
        className="h-48 w-full sm:h-80" // altura menor no mobile (h-48 = 12rem)
      >
        <BarChart
          accessibilityLayer
          data={data}
          layout="vertical"
          margin={
            isMobile
              ? { top: 2, right: 4, left: 0, bottom: 2 }
              : { top: 4, right: 8, left: 0, bottom: 4 }
          }
          barCategoryGap={isMobile ? "12%" : "18%"}
        >
          <CartesianGrid horizontal={false} />

          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            axisLine={false}
            className="text-[9px] sm:text-xs"
          />

          <YAxis
            type="category"
            dataKey="tecnologia"
            tickLine={false}
            axisLine={false}
            width={isMobile ? 52 : 64} // menos espaço para labels no mobile
            tickFormatter={(value: string) =>
              isMobile
                ? value.length > 6
                  ? `${value.slice(0, 6)}…`
                  : value
                : value.length > 8
                  ? `${value.slice(0, 8)}…`
                  : value
            }
            className="text-[9px] sm:text-xs"
          />

          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value) => `${Number(value).toFixed(0)}%`}
              />
            }
          />

          <Bar
            dataKey="percentual"
            radius={4}
            barSize={isMobile ? 10 : 14} // barras mais finas no mobile
            fill="#3b82f6"
          />
        </BarChart>
      </ChartContainer>
    </section>
  );
}
