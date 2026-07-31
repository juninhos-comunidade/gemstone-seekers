import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { PasswordInput } from "./PasswordInput";
import { useRef } from "react";

function getInput(container: HTMLElement): HTMLInputElement {
  return container.querySelector("input") as HTMLInputElement;
}

describe("PasswordInput", () => {
  it("renders input as password by default and toggles visibility when button is clicked", () => {
    const { container } = render(
      <PasswordInput placeholder="Digite sua senha" />,
    );
    const input = getInput(container);
    const button = container.querySelector(
      "button[type='button']",
    ) as HTMLButtonElement;

    expect(input).toHaveAttribute("type", "password");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(button);
    expect(input).toHaveAttribute("type", "password");
  });

  it("handles input value changes, ref forwarding, and custom attributes", () => {
    function Wrapper() {
      const ref = useRef<HTMLInputElement>(null);
      return (
        <PasswordInput
          ref={ref}
          id="pwd-id"
          name="password"
          className="custom-pwd-class"
          defaultValue="initial"
        />
      );
    }

    const { container } = render(<Wrapper />);
    const input = getInput(container);

    expect(input).toHaveAttribute("id", "pwd-id");
    expect(input).toHaveAttribute("name", "password");
    expect(input.className).toContain("custom-pwd-class");

    fireEvent.change(input, { target: { value: "secret123" } });
    expect(input.value).toBe("secret123");
  });
});
