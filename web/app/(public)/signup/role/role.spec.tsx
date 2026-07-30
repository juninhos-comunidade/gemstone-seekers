import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

  it("should renders role selection cards for recruiter and candidate", () => {
    render(<Role />);
    expect(
      screen.getByRole("heading", { name: "Recrutador" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Candidato(a)" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Selecionar" })).toHaveLength(
      2,
    );
  });

  it("should navigates to recruiter or candidate signup routes on button clicks", () => {
    render(<Role />);
    const buttons = screen.getAllByRole("button", { name: "Selecionar" });

    fireEvent.click(buttons[0]);
    expect(mockPush).toHaveBeenCalledWith("/signup/role/recruiter");

    fireEvent.click(buttons[1]);
    expect(mockPush).toHaveBeenCalledWith("/signup/role/candidate");
  });
});
