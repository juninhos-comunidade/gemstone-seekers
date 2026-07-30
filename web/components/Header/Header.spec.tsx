import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

  it("should renders logo and navigation buttons", () => {
    render(<Header />);
    expect(screen.getByText("Gemstone Seekers")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /gemstone seekers/i }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /criar conta/i }),
    ).toBeInTheDocument();
  });

  it("should navigates to /login and /signup on button clicks", () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(mockPush).toHaveBeenCalledWith("/login");

    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));
    expect(mockPush).toHaveBeenCalledWith("/signup");
  });
});
