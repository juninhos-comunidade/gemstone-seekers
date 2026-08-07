import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardHeader } from "./DashboardHeader";

vi.mock("@/components/NotificationsModal/NotificationsModal", () => ({
  NotificationsModal: () => <div>Notifications</div>,
}));

vi.mock("@/components/SettingsModal/SettingsModal", () => ({
  SettingsModal: () => <div>Settings</div>,
}));

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/SideMenu/SideMenu", () => ({
  SideMenu: ({ items }: { items: Array<{ label: string }> }) => (
    <div data-testid="mobile-side-menu">
      {items.map((item) => item.label).join(",")}
    </div>
  ),
}));

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/candidate/dashboard",
}));

describe("DashboardHeader", () => {
  it("renders candidate layout, initials, logo link and handles profile redirect", () => {
    vi.clearAllMocks();
    render(<DashboardHeader role="candidate" />);
    expect(screen.getByText(/painel do candidato/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /perfil/i })).toHaveTextContent(
      /CA/,
    );

    const logoLink = screen.getByRole("link", { name: /gemstone seekers/i });
    expect(logoLink).toHaveAttribute("href", "/candidate/dashboard");

    fireEvent.click(screen.getByRole("button", { name: /perfil/i }));
    expect(mockPush).toHaveBeenCalledWith("/candidate/user");
  });

  it("renders recruiter layout, initials, and handles profile redirect", () => {
    vi.clearAllMocks();
    render(<DashboardHeader role="recruiter" />);
    expect(screen.getByText(/painel do recrutador/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /perfil/i })).toHaveTextContent(
      /RE/,
    );

    fireEvent.click(screen.getByRole("button", { name: /perfil/i }));
    expect(mockPush).toHaveBeenCalledWith("/recruiter/user");
  });

  it("renders mobile menu trigger content when menu items are provided", () => {
    render(
      <DashboardHeader
        role="candidate"
        menuItems={[
          { label: "Dashboard", href: "/candidate/dashboard", icon: "home" },
          {
            label: "Radar",
            href: "/candidate/dashboard/radar",
            icon: "LuRadar",
          },
        ]}
      />,
    );

    expect(screen.getByText("Menu")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-side-menu")).toHaveTextContent(
      "Dashboard,Radar",
    );
  });
});
