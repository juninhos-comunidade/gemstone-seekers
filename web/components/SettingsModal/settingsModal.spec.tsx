import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import SettingsModal from "./SettingsModal";

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

// =====================================================================
// ThemeDropdown é MOCKADO aqui. Por quê?
// 1. Ele usa `useTheme()` do next-themes, que precisaria de <ThemeProvider>
// 2. Ele tem seu PRÓPRIO arquivo de teste (ThemeDropdown.spec.tsx)
// 3. Aqui só importa confirmar que o SettingsModal renderiza ELE no lugar
// =====================================================================
vi.mock("../ThemeDropdown/ThemeDropdown", () => ({
  ThemeDropdown: () => (
    <div data-testid="mock-theme-dropdown">Mocked ThemeDropdown</div>
  ),
}));

describe("Settings Modal", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the settings gear button", () => {
    render(<SettingsModal />);
    expect(
      screen.getByRole("button", { name: /configurações/i }),
    ).toBeInTheDocument();
  });

  it("opens the modal and shows 'Configurações' title when clicking the gear", async () => {
    render(<SettingsModal />);

    const gearButton = screen.getByRole("button", {
      name: /configurações/i,
    });
    fireEvent.click(gearButton);

    expect(
      await screen.findByRole("dialog", { name: /configurações/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/configurações/i)).toBeInTheDocument();
  });

  it("shows the 'Aparência' label + description after opening", async () => {
    render(<SettingsModal />);
    fireEvent.click(screen.getByRole("button", { name: /configurações/i }));

    expect(await screen.findByText(/aparência/i)).toBeInTheDocument();
    expect(
      screen.getByText(/personalize o tema da interface/i),
    ).toBeInTheDocument();
  });

  it("renders the mocked ThemeDropdown inside the modal after opening", async () => {
    render(<SettingsModal />);
    fireEvent.click(screen.getByRole("button", { name: /configurações/i }));

    await screen.findByRole("dialog", { name: /configurações/i });
    expect(screen.getByTestId("mock-theme-dropdown")).toBeInTheDocument();
  });
});
