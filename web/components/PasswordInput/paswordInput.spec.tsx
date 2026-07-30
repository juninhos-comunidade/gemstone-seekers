import "@testing-library/jest-dom/vitest";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { PasswordInput } from "./PasswordInput";
import { useRef } from "react";

function getInput(container: HTMLElement): HTMLInputElement {
  return container.querySelector("input") as HTMLInputElement;
}

describe("PasswordInput", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders an input with type password by default", () => {
    const { container } = render(<PasswordInput />);
    const input = getInput(container);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
  });

  it("renders the toggle visibility button", () => {
    const { container } = render(<PasswordInput />);
    const button = container.querySelector(
      'button[type="button"]',
    ) as HTMLButtonElement;
    expect(button).toBeInTheDocument();
  });

  it("toggles input type from password to text when button is clicked", () => {
    const { container } = render(<PasswordInput />);
    const input = getInput(container);
    const button = container.querySelector(
      'button[type="button"]',
    ) as HTMLButtonElement;

    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(button);
    expect(input).toHaveAttribute("type", "text");
  });

  it("toggles back to password type when clicked twice", () => {
    const { container } = render(<PasswordInput />);
    const input = getInput(container);
    const button = container.querySelector(
      'button[type="button"]',
    ) as HTMLButtonElement;

    fireEvent.click(button);
    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(button);
    expect(input).toHaveAttribute("type", "password");
  });

  it("accepts and displays a value through props", () => {
    const { container } = render(<PasswordInput defaultValue="mypassword" />);
    const input = getInput(container);
    expect(input.value).toBe("mypassword");
  });

  it("allows typing into the input", () => {
    const { container } = render(<PasswordInput />);
    const input = getInput(container);

    fireEvent.change(input, { target: { value: "secret123" } });
    expect(input.value).toBe("secret123");
  });

  it("forwards the ref to the underlying input element", () => {
    function Wrapper() {
      const ref = useRef<HTMLInputElement>(null);
      return <PasswordInput ref={ref} id="test-password" />;
    }

    const { container } = render(<Wrapper />);
    const input = getInput(container);
    expect(input).toHaveAttribute("id", "test-password");
  });

  it("passes additional html attributes through to the input", () => {
    const { container } = render(
      <PasswordInput
        id="pwd"
        name="password"
        placeholder="Digite sua senha"
        required
        autoComplete="current-password"
      />,
    );
    const input = getInput(container);
    expect(input).toHaveAttribute("id", "pwd");
    expect(input).toHaveAttribute("name", "password");
    expect(input).toHaveAttribute("placeholder", "Digite sua senha");
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("autoComplete", "current-password");
  });

  it("applies custom className alongside the base classes", () => {
    const { container } = render(<PasswordInput className="my-custom-class" />);
    const input = getInput(container);
    expect(input.className).toContain("my-custom-class");
  });

  it("keeps the toggle button as type button to prevent form submission", () => {
    const { container } = render(<PasswordInput />);
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.type).toBe("button");
  });
});
