import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

describe("ConfirmDeleteDialog Component", () => {
  it("renders with default title and description", () => {
    render(
      <ConfirmDeleteDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText("Confirmar exclusão")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Tem certeza que deseja remover este item? Esta ação não poderá ser desfeita.",
      ),
    ).toBeInTheDocument();
  });

  it("renders loading state when isLoading is true", () => {
    render(
      <ConfirmDeleteDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={true}
      />,
    );

    expect(screen.getByText("Excluindo...")).toBeInTheDocument();
  });
});
