import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { NotificationModel } from "./NotificationModel";

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

describe("Notification Model", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the notification placeholder", () => {
    render(<NotificationModel />);
    expect(screen.getByText(/Notificação/i)).toBeInTheDocument();
  });

  it("renders the notification content", () => {
    render(<NotificationModel />);
    expect(
      screen.getByText(
        /Bem-vindo! Em breve você poderá acompanhar suas vagas, testes e candidaturas por aqui./i,
      ),
    ).toBeInTheDocument();
  });
});
