import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";

import Login, { getDashboardRoute } from "./page";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

const mockUseRouter = vi.mocked(useRouter);

describe("Login", () => {
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

  it("should render the login page", () => {
    render(<Login />);

    expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
  });

  it("should render the login form", () => {
    render(<Login />);

    expect(screen.getByRole("textbox", { name: "E-mail" })).toBeInTheDocument();

    expect(screen.getByLabelText("Senha")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();

    expect(screen.getByText("Não possui uma conta?")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Cadastre-se" }),
    ).toBeInTheDocument();
  });

  it("should return the candidate dashboard route", () => {
    expect(getDashboardRoute("candidate")).toBe("/candidate/dashboard");
  });

  it("should return the recruiter dashboard route", () => {
    expect(getDashboardRoute("recruiter")).toBe("/recruiter/dashboard");
  });

  it("should navigate to the candidate dashboard", () => {
    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(mockPush).toHaveBeenCalledTimes(1);

    expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
  });

  it("should have a link to signup/role", () => {
    render(<Login />);

    const link = screen.getByRole("link", {
      name: "Cadastre-se",
    });

    expect(link).toHaveAttribute("href", "/signup/role");
  });
});
