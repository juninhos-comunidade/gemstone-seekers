import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
  it("should renders recruiter profile name, role, avatar, bio, experiences and projects", () => {
    render(<RecruiterUserPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: MOCK_RECRUITER_USER.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(MOCK_RECRUITER_USER.role)).toBeInTheDocument();
    expect(
      screen.getByAltText(`Avatar de ${MOCK_RECRUITER_USER.name}`),
    ).toHaveAttribute("src", expect.stringContaining("ui-avatars.com"));
    expect(screen.getByText(MOCK_RECRUITER_USER.bio)).toBeInTheDocument();
    expect(
      screen.getByText(MOCK_RECRUITER_USER.experiences[0].role),
    ).toBeInTheDocument();
    expect(
      screen.getByText(MOCK_RECRUITER_USER.projects[0].title),
    ).toBeInTheDocument();
  });
});
