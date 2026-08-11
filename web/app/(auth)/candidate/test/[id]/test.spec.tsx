import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TestPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/candidate/tests/123",
  useParams: () => ({ id: "123" }),
}));

describe("Test Question Page", () => {
  it("renders question title and answer options", () => {
    render(<TestPage />);
    expect(
      screen.getByText(/Qual linguagem é utilizada pelo React\?/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/JavaScript/i)).toBeInTheDocument();
    expect(screen.getByText(/Python/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Java$/i)).toBeInTheDocument();
  });

  it("allows selecting an answer option", () => {
    render(<TestPage />);
    const javascriptOption = screen.getByLabelText(/JavaScript/i);
    fireEvent.click(javascriptOption);
    expect(javascriptOption).toBeChecked();
  });

  it("shows selected answer option", () => {
    render(<TestPage />);
    const pythonOption = screen.getByLabelText(/Python/i);
    fireEvent.click(pythonOption);
    expect(pythonOption).toBeChecked();
  });
});
