import type { ChartConfig } from "@/components/ui/chart";

export const RADAR_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#ef4444",
  "#84cc16",
  "#14b8a6",
  "#f97316",
];

export const categoryColorMap: Record<string, string> = {
  Frontend: RADAR_COLORS[0],
  Backend: RADAR_COLORS[1],
  Cloud: RADAR_COLORS[2],
  DevOps: RADAR_COLORS[3],
  "Banco de Dados": RADAR_COLORS[4],
  Mobile: RADAR_COLORS[5],
};

export const radarChartConfig = {
  vagas: {
    label: "Vagas",
    color: "#3b82f6",
  },
  obrigatorias: {
    label: "Obrigatórias",
    color: "#8b5cf6",
  },
  Frontend: {
    label: "Frontend",
    color: "#3b82f6",
  },
  Backend: {
    label: "Backend",
    color: "#8b5cf6",
  },
  Cloud: {
    label: "Cloud",
    color: "#06b6d4",
  },
  DevOps: {
    label: "DevOps",
    color: "#10b981",
  },
  "Banco de Dados": {
    label: "Banco de Dados",
    color: "#f59e0b",
  },
  Mobile: {
    label: "Mobile",
    color: "#ec4899",
  },
} satisfies ChartConfig;
