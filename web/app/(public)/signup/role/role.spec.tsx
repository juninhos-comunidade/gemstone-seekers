import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Role from "./page";

const mockPush = vi.fn();
const mockHandleSubmit = vi.fn();
const mockSetValue = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("react-hook-form", () => ({
  useForm: () => ({
    handleSubmit: mockHandleSubmit,
    setValue: mockSetValue,
    formState: { isSubmitting: false },
  }),
}));

const mockUseRouter = vi.mocked(useRouter);

describe("Role Selection Page", () => {
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
    mockHandleSubmit.mockImplementation(
      (callback) => () => callback({ role: "candidate" }),
    );
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

  it("should set selected role on button clicks and navigate", () => {
    render(<Role />);
    const buttons = screen.getAllByRole("button", { name: "Selecionar" });

    fireEvent.click(buttons[0]);
    expect(mockSetValue).toHaveBeenCalledWith("role", "recruiter");

    fireEvent.click(buttons[1]);
    expect(mockSetValue).toHaveBeenCalledWith("role", "candidate");
  });

  it("handles recruiter role selection and catch block on setItem failure", () => {
    mockHandleSubmit.mockImplementation(
      (callback) => () => callback({ role: "recruiter" }),
    );

    render(<Role />);
    const buttons = screen.getAllByRole("button", { name: "Selecionar" });
    fireEvent.submit(buttons[0].closest("form")!);

    expect(mockPush).toHaveBeenCalledWith("/signup/role/recruiter");

    const spySetItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementationOnce(() => {
        throw new Error("localStorage blocked");
      });

    fireEvent.submit(buttons[0].closest("form")!);
    spySetItem.mockRestore();
  });
});
