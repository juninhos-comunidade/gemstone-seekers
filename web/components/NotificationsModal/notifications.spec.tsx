import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
  it("renders bell button and opens modal when clicked", async () => {
    render(<NotificationsModal />);
    const bellButton = screen.getByRole("button", { name: /notificações/i });
    expect(bellButton).toBeInTheDocument();

    fireEvent.click(bellButton);
    expect(
      await screen.findByRole("dialog", { name: /notificações/i }),
    ).toBeInTheDocument();
  });
});
