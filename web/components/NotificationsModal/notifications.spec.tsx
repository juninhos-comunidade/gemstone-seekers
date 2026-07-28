import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { NotificationsModal } from "./NotificationsModal";

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

describe("Notifications Modal", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the notifications bell button", () => {
    render(<NotificationsModal />);
    expect(
      screen.getByRole("button", { name: /notificações/i }),
    ).toBeInTheDocument();
  });

  it("opens the modal and shows 'Notificações' title when clicking the bell", async () => {
    render(<NotificationsModal />);

    const bellButton = screen.getByRole("button", {
      name: /notificações/i,
    });
    fireEvent.click(bellButton);

    expect(
      await screen.findByRole("dialog", { name: /notificações/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/notificações/i)).toBeInTheDocument();
  });
});
