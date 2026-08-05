import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsModal } from "./SettingsModal";

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

describe("Settings Modal", () => {
  it("renders gear button and opens settings modal with appearance options", async () => {
    render(<SettingsModal />);
    const gearButton = screen.getByRole("button", { name: /configurações/i });
    expect(gearButton).toBeInTheDocument();

    fireEvent.click(gearButton);
    expect(
      await screen.findByRole("dialog", { name: /configurações/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/aparência/i)).toBeInTheDocument();
    expect(
      screen.getByText(/personalize o tema da interface/i),
    ).toBeInTheDocument();
  });
});
