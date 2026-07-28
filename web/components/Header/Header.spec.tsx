import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header/Header";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

const mockUseRouter = vi.mocked(useRouter);

describe("Header", () => {
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

  it("deve renderizar o logo e o título do app", () => {
    render(<Header />);
    expect(screen.getByText("Gemstone Seekers")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /gemstone seekers/i }),
    ).toHaveAttribute("href", "/");
  });

  it("deve renderizar os botões de Login e Criar conta", () => {
    render(<Header />);
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /criar conta/i }),
    ).toBeInTheDocument();
  });

  it("deve navegar para /login ao clicar no botão Login", () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("deve navegar para /signup/role ao clicar no botão Criar conta", () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/signup/role");
  });
});
