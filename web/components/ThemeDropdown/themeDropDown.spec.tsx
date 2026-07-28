import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
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

  afterEach(() => {
    cleanup();
  });

  it("renders the theme toggle button", () => {
    render(<ThemeDropdown />);
    expect(
      screen.getByRole("button", { name: /alternar tema/i }),
    ).toBeInTheDocument();
  });

  it("opens the dropdown and shows all three options after clicking the toggle", async () => {
    render(<ThemeDropdown />);
    fireEvent.click(screen.getByRole("button", { name: /alternar tema/i }));

    expect(await screen.findByText(/light/i)).toBeInTheDocument();
    expect(screen.getByText(/dark/i)).toBeInTheDocument();
    expect(screen.getByText(/system/i)).toBeInTheDocument();
  });

  it("calls setTheme('light') when clicking the Light option", async () => {
    render(<ThemeDropdown />);
    fireEvent.click(screen.getByRole("button", { name: /alternar tema/i }));

    const lightItem = await screen.findByText(/light/i);
    fireEvent.click(lightItem);

    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("calls setTheme('dark') when clicking the Dark option", async () => {
    render(<ThemeDropdown />);
    fireEvent.click(screen.getByRole("button", { name: /alternar tema/i }));

    const darkItem = await screen.findByText(/dark/i);
    fireEvent.click(darkItem);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme('system') when clicking the System option", async () => {
    render(<ThemeDropdown />);
    fireEvent.click(screen.getByRole("button", { name: /alternar tema/i }));

    const systemItem = await screen.findByText(/system/i);
    fireEvent.click(systemItem);

    expect(mockSetTheme).toHaveBeenCalledWith("system");
  });
});
