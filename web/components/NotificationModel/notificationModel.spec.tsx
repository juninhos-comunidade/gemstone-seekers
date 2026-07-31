import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationModel } from "./NotificationModel";

describe("Notification Model", () => {
  it("renders notification placeholder title and welcome content", () => {
    render(<NotificationModel />);
    expect(screen.getByText(/Notificação/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Bem-vindo! Em breve você poderá acompanhar/i),
    ).toBeInTheDocument();
  });
});
