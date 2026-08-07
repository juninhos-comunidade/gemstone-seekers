import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Activity } from "lucide-react";
import { MetricCard } from "./MetricCard";

describe("MetricCard", () => {
  it("renders icon, value and label", () => {
    render(
      <MetricCard
        icon={<Activity aria-label="activity icon" />}
        value={42}
        label="Tecnologias monitoradas"
      />,
    );

    expect(screen.getByLabelText(/activity icon/i)).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText(/tecnologias monitoradas/i)).toBeInTheDocument();
  });
});
