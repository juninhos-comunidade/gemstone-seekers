import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import ProfilePage from "./page";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => <img src={src} alt={alt} className={className} />,
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
  usePathname: () => "/recruiter/user",
}));

describe("Recruiter User Profile Page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the recruiter name in the heading", () => {
    render(<ProfilePage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Thiago/i);
    expect(heading).toHaveTextContent(/Recrutador/i);
  });

  it("renders the recruiter avatar", () => {
    render(<ProfilePage />);
    const avatar = screen.getByAltText(/avatar/i);
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute(
      "src",
      expect.stringContaining("ui-avatars.com"),
    );
  });

  it("renders the profile description paragraph", () => {
    render(<ProfilePage />);
    expect(screen.getByText(/Lorem ipsum dolor sit amet/i)).toBeInTheDocument();
  });
});
