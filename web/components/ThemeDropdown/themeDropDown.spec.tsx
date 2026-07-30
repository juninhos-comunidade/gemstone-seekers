import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useTheme } from "next-themes";
import { ThemeDropdown } from "./ThemeDropdown";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/candidate/dashboard",
}));

const mockUseTheme = vi.mocked(useTheme);

describe("Theme Dropdown", () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTheme.mockReturnValue({
      setTheme: mockSetTheme,
      theme: undefined,
      resolvedTheme: undefined,
      themes: ["light", "dark", "system"],
      systemTheme: "light",
    });
  });

  it("opens dropdown and renders light, dark, system options", async () => {
    render(<ThemeDropdown />);
    const button = screen.getByRole("button", { name: /alternar tema/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(await screen.findByText(/light/i)).toBeInTheDocument();
    expect(screen.getByText(/dark/i)).toBeInTheDocument();
    expect(screen.getByText(/system/i)).toBeInTheDocument();
  });

  it("calls setTheme when a theme option is selected", async () => {
    render(<ThemeDropdown />);
    fireEvent.click(screen.getByRole("button", { name: /alternar tema/i }));

    const darkItem = await screen.findByText(/dark/i);
    fireEvent.click(darkItem);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });
});
