import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders provided message", () => {
    render(
      <EmptyState message="Ainda não existem dados suficientes no radar." />,
    );

    expect(
      screen.getByText(/ainda não existem dados suficientes no radar/i),
    ).toBeInTheDocument();
  });
});
