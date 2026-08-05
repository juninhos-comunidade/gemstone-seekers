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

  it("calls setTheme with light when Light option is selected", async () => {
    render(<ThemeDropdown />);
    fireEvent.click(screen.getByRole("button", { name: /alternar tema/i }));

    const lightItem = await screen.findByText(/light/i);
    fireEvent.click(lightItem);
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("calls setTheme with dark when Dark option is selected", async () => {
    render(<ThemeDropdown />);
    fireEvent.click(screen.getByRole("button", { name: /alternar tema/i }));

    const darkItem = await screen.findByText(/dark/i);
    fireEvent.click(darkItem);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme with system when System option is selected", async () => {
    render(<ThemeDropdown />);
    fireEvent.click(screen.getByRole("button", { name: /alternar tema/i }));

    const systemItem = await screen.findByText(/system/i);
    fireEvent.click(systemItem);
    expect(mockSetTheme).toHaveBeenCalledWith("system");
  });
});
