import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { SelectFilter } from "./SelectFilter";

type MockSelectProps = {
  value?: string | null;
  onValueChange?: (_value: string) => void;
  disabled?: boolean;
  children?: ReactNode;
};

type MockChildrenProps = {
  children?: ReactNode;
};

type MockItemProps = {
  children?: ReactNode;
  value: string;
};

vi.mock("@/components/ui/select", () => ({
  Select: ({ value, onValueChange, disabled, children }: MockSelectProps) => (
    <select
      aria-label="Filtro"
      value={value ?? ""}
      disabled={disabled}
      onChange={(event) => onValueChange?.(event.target.value)}
    >
      {children}
    </select>
  ),
  SelectContent: ({ children }: MockChildrenProps) => <>{children}</>,
  SelectGroup: ({ children }: MockChildrenProps) => <>{children}</>,
  SelectItem: ({ children, value }: MockItemProps) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children }: MockChildrenProps) => <>{children}</>,
  SelectValue: () => null,
}));

describe("SelectFilter", () => {
  const items = [
    { value: "", label: "Todas as tecnologias" },
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
  ];

  it("renders all provided options", () => {
    render(
      <SelectFilter
        items={items}
        placeholder="Filtrar por tecnologia"
        ariaLabel="Filtro"
      />,
    );

    expect(screen.getByLabelText(/filtro/i)).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /todas as tecnologias/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /react/i })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /node\.js/i }),
    ).toBeInTheDocument();
  });

  it("supports controlled value and calls onValueChange", () => {
    const handleChange = vi.fn();

    render(
      <SelectFilter
        items={items}
        value="React"
        onValueChange={handleChange}
        placeholder="Filtrar por tecnologia"
      />,
    );

    const select = screen.getByLabelText(/filtro/i);
    expect(select).toHaveValue("React");

    fireEvent.change(select, {
      target: { value: "Node.js" },
    });

    expect(handleChange).toHaveBeenCalledWith("Node.js");
  });

  it("respects disabled prop", () => {
    render(
      <SelectFilter
        items={items}
        disabled
        placeholder="Filtrar por tecnologia"
      />,
    );

    expect(screen.getByLabelText(/filtro/i)).toBeDisabled();
  });
});
