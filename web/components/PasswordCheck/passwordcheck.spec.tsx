import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PasswordCheck } from "./PasswordInput";

describe("PasswordCheck", () => {
  it("renders password input and strength helper", () => {
    render(<PasswordCheck />);

    expect(screen.getByLabelText("Mostrar senha")).toBeInTheDocument();

    expect(
      screen.getByRole("progressbar", { name: "Força da senha" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Digite uma senha")).toBeInTheDocument();

    expect(screen.getByText("0/5 requisitos atendidos")).toBeInTheDocument();
  });

  it("updates strength feedback when typing a strong password", () => {
    render(<PasswordCheck />);

    const input = document.querySelector(
      "input[type='password']",
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { value: "Strong123!" },
    });

    expect(screen.getByText("Segurança forte")).toBeInTheDocument();

    expect(screen.getByText("5/5 requisitos atendidos")).toBeInTheDocument();

    expect(
      screen.getByText("Pelo menos 1 letra maiúscula"),
    ).toBeInTheDocument();
  });

  it("renders with custom label when hideLabel is false and custom id", () => {
    render(
      <PasswordCheck
        label="Sua Senha"
        hideLabel={false}
        id="custom-password-id"
      />,
    );

    expect(screen.getByLabelText("Sua Senha")).toBeInTheDocument();

    expect(screen.getByLabelText("Sua Senha")).toHaveAttribute(
      "id",
      "custom-password-id",
    );
  });

  it("calculates score levels (Fraca, Média, Forte) and toggles visibility", () => {
    const { rerender } = render(<PasswordCheck value="a" />);

    expect(screen.getByText("Segurança fraca")).toBeInTheDocument();

    rerender(<PasswordCheck value="a1" />);
    expect(screen.getByText("Segurança fraca")).toBeInTheDocument();

    rerender(<PasswordCheck value="a1B" />);
    expect(screen.getByText("Segurança média")).toBeInTheDocument();

    rerender(<PasswordCheck value="a1B!" />);
    expect(screen.getByText("Segurança média")).toBeInTheDocument();

    rerender(<PasswordCheck value="a1B!5678" />);
    expect(screen.getByText("Segurança forte")).toBeInTheDocument();

    const toggleButton = screen.getByLabelText("Mostrar senha");

    fireEvent.click(toggleButton);

    expect(screen.getByLabelText("Ocultar senha")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Ocultar senha"));

    expect(screen.getByLabelText("Mostrar senha")).toBeInTheDocument();
  });
});
