import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
  it("should renders candidate profile name, role, avatar, bio, experiences and projects", () => {
    render(<CandidateUserPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: MOCK_CANDIDATE_USER.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(MOCK_CANDIDATE_USER.role)).toBeInTheDocument();
    expect(
      screen.getByAltText(`Avatar de ${MOCK_CANDIDATE_USER.name}`),
    ).toHaveAttribute("src", expect.stringContaining("ui-avatars.com"));
    expect(screen.getByText(MOCK_CANDIDATE_USER.bio)).toBeInTheDocument();
    expect(
      screen.getByText(MOCK_CANDIDATE_USER.experiences[0].role),
    ).toBeInTheDocument();
    expect(
      screen.getByText(MOCK_CANDIDATE_USER.projects[0].title),
    ).toBeInTheDocument();
  });
});
