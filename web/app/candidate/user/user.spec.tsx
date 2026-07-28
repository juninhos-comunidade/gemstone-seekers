import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MOCK_USER } from "@/Mocks/userMock";
import ProfilePage from "./page";
import Image from "next/image";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => <Image src={src} alt={alt} className={className} />,
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
  usePathname: () => "/candidate/user",
}));

describe("Candidate User Profile Page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the user avatar", () => {
    render(<ProfilePage />);
    const avatar = screen.getByAltText(MOCK_USER.name);
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", MOCK_USER.avatarUrl);
  });

  it("renders the user name and role", () => {
    render(<ProfilePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: MOCK_USER.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(MOCK_USER.role)).toBeInTheDocument();
  });

  it("renders the About section with bio", () => {
    render(<ProfilePage />);
    expect(
      screen.getByRole("heading", { level: 2, name: /sobre/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(MOCK_USER.bio)).toBeInTheDocument();
  });

  it("renders the Professional Experience section", () => {
    render(<ProfilePage />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /experiência profissional/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders all user experiences", () => {
    render(<ProfilePage />);
    MOCK_USER.experiences.forEach((exp) => {
      expect(screen.getByText(exp.role, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(exp.company)).toBeInTheDocument();
      expect(screen.getByText(exp.period)).toBeInTheDocument();
      expect(screen.getByText(exp.description)).toBeInTheDocument();
    });
  });
});
