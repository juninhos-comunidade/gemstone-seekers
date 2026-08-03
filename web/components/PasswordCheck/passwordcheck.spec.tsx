import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PasswordCheck } from "./PasswordInput";

describe("PasswordCheck", () => {
  it("renders password input and strength helper", () => {
    render(<PasswordCheck />);

    expect(screen.getByLabelText("Show password")).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Password strength" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter a password")).toBeInTheDocument();
    expect(screen.getByText("0/5 requirements met")).toBeInTheDocument();
  });

  it("updates strength feedback when typing a strong password", () => {
    render(<PasswordCheck />);

    const input = document.querySelector(
      "input[type='password']",
    ) as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: "Strong123!" },
    });

    expect(screen.getByText("Strong security")).toBeInTheDocument();
    expect(screen.getByText("5/5 requirements met")).toBeInTheDocument();
    expect(screen.getByText("At least 1 uppercase letter")).toBeInTheDocument();
  });

  it("forwards onChange and toggles password visibility", () => {
    const handleChange = vi.fn();
    render(<PasswordCheck onChange={handleChange} defaultValue="abc" />);

    const input = screen.getByDisplayValue("abc");
    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByLabelText("Show password"));
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Hide password")).toBeInTheDocument();

    fireEvent.change(input, {
      target: { value: "abc123A!" },
    });

    expect(handleChange).toHaveBeenCalled();
  });
});
