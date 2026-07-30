import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import CandidateUserPage from "./page";
import { MOCK_CANDIDATE_USER } from "@/lib/mocks/userMock";

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

describe("Candidate User Profile Page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the candidate name and role", () => {
    render(<CandidateUserPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: MOCK_CANDIDATE_USER.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(MOCK_CANDIDATE_USER.role)).toBeInTheDocument();
  });

  it("renders the candidate avatar", () => {
    render(<CandidateUserPage />);

    const avatar = screen.getByAltText(`Avatar de ${MOCK_CANDIDATE_USER.name}`);
    expect(avatar).toHaveAttribute(
      "src",
      expect.stringContaining("ui-avatars.com"),
    );
  });

  it("renders profile sections from the mock", () => {
    render(<CandidateUserPage />);

    expect(screen.getByText(MOCK_CANDIDATE_USER.bio)).toBeInTheDocument();
    expect(
      screen.getByText(MOCK_CANDIDATE_USER.experiences[0].role),
    ).toBeInTheDocument();
    expect(
      screen.getByText(MOCK_CANDIDATE_USER.projects[0].title),
    ).toBeInTheDocument();
  });
});
