import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";
import { SelectLevel } from "./SelectLevel";

type MockSelectProps = {
  value?: string | null;
  onValueChange?: (_value: string) => void;
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
  Select: ({ value, onValueChange, children }: MockSelectProps) => (
    <select
      aria-label="Nível de experiência"
      value={value ?? ""}
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

describe("SelectLevel", () => {
  it("renders experience options", () => {
    render(<SelectLevel />);

    expect(screen.getByLabelText(/nível de experiência/i)).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /selecione/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /estagiário/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /júnior/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /pleno/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /sênior/i })).toBeInTheDocument();
  });

  it("supports controlled value and calls onValueChange", () => {
    const handleChange = vi.fn();

    render(
      <SelectLevel value="junior" onValueChange={handleChange} disabled />,
    );

    const select = screen.getByLabelText(/nível de experiência/i);
    expect(select).toHaveValue("junior");

    fireEvent.change(select, {
      target: { value: "pleno" },
    });

    expect(handleChange).toHaveBeenCalledWith("pleno");
  });
});
