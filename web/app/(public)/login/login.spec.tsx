import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Login from "./page";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

const mockUseRouter = vi.mocked(useRouter);

describe("Login Page", () => {
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

  it("should renders login form fields and signup link", () => {
    render(<Login />);
    expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "E-mail" })).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cadastre-se" })).toHaveAttribute(
      "href",
      "/signup/role",
    );
  });

  it("should navigates to candidate dashboard on valid form submission", async () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/^e-mail$/i), {
      target: { value: "candidato@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Senha"), {
      target: { value: "senha123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/candidate/dashboard");
    });
  });
});
