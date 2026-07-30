import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";

import Role from "./page";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

const mockUseRouter = vi.mocked(useRouter);

describe("Role Selection Page", () => {
  const mockPush = vi.fn();
  const mockRouter = {
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    cleanup();
  });

  it("should have recruiter button", () => {
    render(<Role />);
    expect(
      screen.getByRole("heading", { name: "Recrutador" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Você é um recrutador?")).toBeInTheDocument();
    const buttons = screen.getAllByRole("button", { name: "Selecionar" });
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toBeInTheDocument();
  });

  it("should have candidate button", () => {
    render(<Role />);
    expect(
      screen.getByRole("heading", { name: "Candidato(a)" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Você é um candidato?")).toBeInTheDocument();
    const buttons = screen.getAllByRole("button", { name: "Selecionar" });
    expect(buttons).toHaveLength(2);
    expect(buttons[1]).toBeInTheDocument();
  });

  it("should have go to a recruiter signUp", () => {
    render(<Role />);
    const buttons = screen.getAllByRole("button", { name: "Selecionar" });
    expect(buttons).toHaveLength(2);
    const recruiterButton = buttons[0];
    expect(recruiterButton).toBeInTheDocument();
    fireEvent.click(recruiterButton);
    expect(mockPush).toHaveBeenCalledWith("/signup/role/recruiter");
  });

  it("should have go to a candidate signUp", () => {
    render(<Role />);
    const buttons = screen.getAllByRole("button", { name: "Selecionar" });
    expect(buttons).toHaveLength(2);
    const candidateButton = buttons[1];
    expect(candidateButton).toBeInTheDocument();
    fireEvent.click(candidateButton);
    expect(mockPush).toHaveBeenCalledWith("/signup/role/candidate");
  });
});
