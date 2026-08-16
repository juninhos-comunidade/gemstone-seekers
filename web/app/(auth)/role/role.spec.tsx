import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { setUserRole } from "@/lib/api/auth";
import { toast } from "sonner";
import Role from "./page";

const mockPush = vi.fn();
const mockHandleSubmit = vi.fn();
const mockSetValue = vi.fn();

// Controls the `isSubmitting` value returned by the mocked useForm on each render,
// so we can exercise the loading state without reimplementing react-hook-form.
let isSubmittingMock = false;

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("react-hook-form", () => ({
  useForm: () => ({
    handleSubmit: mockHandleSubmit,
    setValue: mockSetValue,
    formState: {
      get isSubmitting() {
        return isSubmittingMock;
      },
    },
  }),
}));

vi.mock("@/lib/api/auth", () => ({
  setUserRole: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockUseRouter = vi.mocked(useRouter);
const mockSetUserRole = vi.mocked(setUserRole);
const mockToastError = vi.mocked(toast.error);

const mockRouter = {
  push: mockPush,
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
};

describe("Role Selection Page - form interactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isSubmittingMock = false;
    mockUseRouter.mockReturnValue(mockRouter);
    mockHandleSubmit.mockImplementation(
      (callback) => () => callback({ role: "candidate" }),
    );
  });

  it("should renders role selection cards for recruiter and candidate", async () => {
    render(<Role />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Recrutador" }),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByRole("heading", { name: "Candidato(a)" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Selecionar" })).toHaveLength(
      2,
    );
  });

  it("should set selected role on button clicks and navigate", async () => {
    render(<Role />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Recrutador" }),
      ).toBeInTheDocument(),
    );

    const buttons = screen.getAllByRole("button", { name: "Selecionar" });

    fireEvent.click(buttons[0]);
    expect(mockSetValue).toHaveBeenCalledWith("role", "recruiter");

    fireEvent.click(buttons[1]);
    expect(mockSetValue).toHaveBeenCalledWith("role", "candidate");
  });

  it("handles recruiter role selection and catch block on setItem failure", async () => {
    mockHandleSubmit.mockImplementation(
      (callback) => () => callback({ role: "recruiter" }),
    );

    render(<Role />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Recrutador" }),
      ).toBeInTheDocument(),
    );

    const buttons = screen.getAllByRole("button", { name: "Selecionar" });
    fireEvent.submit(buttons[0].closest("form")!);

    expect(mockPush).toHaveBeenCalledWith("/role/recruiter");
    expect(mockSetUserRole).toHaveBeenCalledWith("RECRUITER");

    const spySetItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementationOnce(() => {
        throw new Error("localStorage blocked");
      });

    fireEvent.submit(buttons[0].closest("form")!);
    spySetItem.mockRestore();
  });

  it("navigates to /role/candidate on candidate selection", async () => {
    mockHandleSubmit.mockImplementation(
      (callback) => () => callback({ role: "candidate" }),
    );

    render(<Role />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Recrutador" }),
      ).toBeInTheDocument(),
    );

    const buttons = screen.getAllByRole("button", { name: "Selecionar" });
    fireEvent.submit(buttons[1].closest("form")!);

    expect(mockPush).toHaveBeenCalledWith("/role/candidate");
    expect(mockSetUserRole).toHaveBeenCalledWith("CANDIDATE");
  });

  it("shows a toast error and does not navigate when setItem throws", async () => {
    mockHandleSubmit.mockImplementation(
      (callback) => () => callback({ role: "recruiter" }),
    );

    render(<Role />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Recrutador" }),
      ).toBeInTheDocument(),
    );

    const spySetItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementationOnce(() => {
        throw new Error("localStorage blocked");
      });

    const buttons = screen.getAllByRole("button", { name: "Selecionar" });
    fireEvent.submit(buttons[0].closest("form")!);

    expect(mockToastError).toHaveBeenCalledWith("Erro ao selecionar perfil");
    expect(mockPush).not.toHaveBeenCalled();

    spySetItem.mockRestore();
  });

  it("renders the loading state with spinners and disabled buttons while submitting", async () => {
    isSubmittingMock = true;

    render(<Role />);
    await waitFor(() =>
      expect(screen.getAllByText("Selecionando...")).toHaveLength(2),
    );
    screen
      .getAllByRole("button")
      .forEach((button) => expect(button).toBeDisabled());
    expect(screen.queryByText("Selecionar")).not.toBeInTheDocument();
  });
});
