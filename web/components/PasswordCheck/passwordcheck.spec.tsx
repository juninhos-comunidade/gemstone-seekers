import { describe, it, expect } from "vitest";
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

  it("renders with custom label when hideLabel is false and custom id", () => {
    render(
      <PasswordCheck
        id="custom-password-id"
        label="Sua Senha"
        hideLabel={false}
      />,
    );

    expect(screen.getByLabelText("Sua Senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Sua Senha")).toHaveAttribute(
      "id",
      "custom-password-id",
    );
  });

  it("calculates score levels (Weak, Medium, Strong) and toggle visibility back", () => {
    const { rerender } = render(<PasswordCheck value="a" />);
    expect(screen.getByText("Weak security")).toBeInTheDocument();

    rerender(<PasswordCheck value="a1" />);
    expect(screen.getByText("Weak security")).toBeInTheDocument();

    rerender(<PasswordCheck value="a1B" />);
    expect(screen.getByText("Medium security")).toBeInTheDocument();

    rerender(<PasswordCheck value="a1B!" />);
    expect(screen.getByText("Medium security")).toBeInTheDocument();

    rerender(<PasswordCheck value="a1B!5678" />);
    expect(screen.getByText("Strong security")).toBeInTheDocument();

    const toggleButton = screen.getByLabelText("Show password");
    fireEvent.click(toggleButton);
    expect(screen.getByLabelText("Hide password")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Hide password"));
    expect(screen.getByLabelText("Show password")).toBeInTheDocument();
  });
});
