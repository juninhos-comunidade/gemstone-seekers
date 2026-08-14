import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/api/auth";
import { httpClient } from "@/lib/api/client";
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
  getAuthToken: vi.fn(),
}));

vi.mock("@/lib/api/client", () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockUseRouter = vi.mocked(useRouter);
const mockGetAuthToken = vi.mocked(getAuthToken);
const mockHttpClientGet = vi.mocked(httpClient.get);
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
    // Seed a valid auth state so the effect resolves before form assertions.
    mockGetAuthToken.mockReturnValue("valid-token");
    mockHttpClientGet.mockResolvedValue({
      result: { registrationCompleted: false },
    });
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
    // Auth check must complete (checkingAuth → false) before the form renders.
    // With isSubmitting=true the buttons show "Selecionando..." instead of "Selecionar".
    await waitFor(() =>
      expect(screen.getAllByText("Selecionando...")).toHaveLength(2),
    );
    screen
      .getAllByRole("button")
      .forEach((button) => expect(button).toBeDisabled());
    expect(screen.queryByText("Selecionar")).not.toBeInTheDocument();
  });
});

describe("Role Selection Page - auth check effect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isSubmittingMock = false;
    mockUseRouter.mockReturnValue(mockRouter);
    mockHandleSubmit.mockImplementation(
      (callback) => () => callback({ role: "candidate" }),
    );
  });

  it("redirects to /login when there is no token", async () => {
    mockGetAuthToken.mockReturnValue(null);

    render(<Role />);

    await waitFor(() =>
      expect(mockRouter.replace).toHaveBeenCalledWith("/login"),
    );
  });

  it("redirects to /recruiter/dashboard when registration is complete and role is RECRUITER", async () => {
    mockGetAuthToken.mockReturnValue("valid-token");
    mockHttpClientGet.mockResolvedValue({
      result: { registrationCompleted: true, role: "RECRUITER" },
    });

    render(<Role />);

    await waitFor(() =>
      expect(mockRouter.replace).toHaveBeenCalledWith("/recruiter/dashboard"),
    );
  });

  it("redirects to /candidate/dashboard when registration is complete and role is not RECRUITER", async () => {
    mockGetAuthToken.mockReturnValue("valid-token");
    mockHttpClientGet.mockResolvedValue({
      result: { registrationCompleted: true, role: "CANDIDATE" },
    });

    render(<Role />);

    await waitFor(() =>
      expect(mockRouter.replace).toHaveBeenCalledWith("/candidate/dashboard"),
    );
  });

  it("stops checking and shows the form when registration is not complete", async () => {
    mockGetAuthToken.mockReturnValue("valid-token");
    mockHttpClientGet.mockResolvedValue({
      result: { registrationCompleted: false },
    });

    render(<Role />);

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Recrutador" }),
      ).toBeInTheDocument(),
    );
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it("shows the form when the /profile request fails", async () => {
    mockGetAuthToken.mockReturnValue("valid-token");
    mockHttpClientGet.mockRejectedValue(new Error("network error"));

    render(<Role />);

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Recrutador" }),
      ).toBeInTheDocument(),
    );
    expect(mockRouter.replace).not.toHaveBeenCalledWith("/login");
  });
});
