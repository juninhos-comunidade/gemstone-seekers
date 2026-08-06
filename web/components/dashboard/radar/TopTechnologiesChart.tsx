"use client";

import { useSyncExternalStore } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { radarChartConfig, RADAR_COLORS } from "./chart-config";

type TopTechnologyItem = {
  tecnologia: string;
  vagas: number;
  fill: string;
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

export function TopTechnologiesChart({ data }: { data: TopTechnologyItem[] }) {
  const isMobile = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <section className="bg-card overflow-hidden rounded-2xl border p-4 shadow-sm sm:p-5 md:p-6">
      <div className="mb-4">
        <h2 className="text-foreground text-base font-semibold sm:text-lg">
          Tecnologias com mais vagas
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Tecnologias mais demandadas por número de vagas.
        </p>
      </div>

      <ChartContainer
        config={radarChartConfig}
        className="h-40 w-full sm:h-72" // altura menor no mobile (h-40 = 10rem)
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={
            isMobile
              ? { top: 4, right: 4, left: 0, bottom: 0 }
              : { top: 8, right: 8, left: -16, bottom: 0 }
          }
          barCategoryGap={isMobile ? "10%" : "18%"}
        >
          <CartesianGrid vertical={false} />

          <XAxis
            dataKey="tecnologia"
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            interval={0}
            tickFormatter={
              (value: string) =>
                value.length > 6 ? `${value.slice(0, 6)}…` : value // rótulos mais curtos no mobile
            }
            className="text-[9px] sm:text-xs" // fonte menor no mobile
          />

          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

          <ChartLegend
            className="hidden sm:flex"
            content={<ChartLegendContent />}
          />

          <Bar
            dataKey="vagas"
            radius={4}
            barSize={isMobile ? 12 : 18} // barras mais finas no mobile
          >
            {data.map((item, index) => (
              <Cell
                key={item.tecnologia}
                fill={item.fill ?? RADAR_COLORS[index % RADAR_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </section>
  );
}
