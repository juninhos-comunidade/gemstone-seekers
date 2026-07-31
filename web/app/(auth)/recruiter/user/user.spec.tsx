import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import RecruiterUserPage from "./page";
import { MOCK_RECRUITER_USER } from "@/lib/mocks/userMock";

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

describe("Recruiter User Profile Page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the recruiter name and role", () => {
    render(<RecruiterUserPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: MOCK_RECRUITER_USER.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(MOCK_RECRUITER_USER.role)).toBeInTheDocument();
  });

  it("renders the recruiter avatar", () => {
    render(<RecruiterUserPage />);

    const avatar = screen.getByAltText(`Avatar de ${MOCK_RECRUITER_USER.name}`);
    expect(avatar).toHaveAttribute(
      "src",
      expect.stringContaining("ui-avatars.com"),
    );
  });

  it("renders profile sections from the mock", () => {
    render(<RecruiterUserPage />);

    expect(screen.getByText(MOCK_RECRUITER_USER.bio)).toBeInTheDocument();
    expect(
      screen.getByText(MOCK_RECRUITER_USER.experiences[0].role),
    ).toBeInTheDocument();
    expect(
      screen.getByText(MOCK_RECRUITER_USER.projects[0].title),
    ).toBeInTheDocument();
  });
});
