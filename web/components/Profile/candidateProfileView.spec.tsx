import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CandidateProfileView } from "@/components/Profile/CandidateProfileView";
import {
  INITIAL_MOCK_CANDIDATE,
  EMPTY_CANDIDATE_MOCK,
} from "@/lib/mocks/candidateMock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

function renderWithQuery(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("CandidateProfileView Component", () => {
  it("renders candidate name and email when data is provided", () => {
    renderWithQuery(
      <CandidateProfileView initialData={INITIAL_MOCK_CANDIDATE} />,
    );

    expect(screen.getByText("Thiago Silva")).toBeInTheDocument();
    expect(
      screen.getAllByText("thiago.silva@exemplo.com")[0],
    ).toBeInTheDocument();
  });

  it("renders empty state message when candidate data is empty", () => {
    renderWithQuery(
      <CandidateProfileView initialData={EMPTY_CANDIDATE_MOCK} />,
    );

    expect(
      screen.getByText("Seu perfil ainda está incompleto"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Preencher Dados do Perfil Agora/i }),
    ).toBeInTheDocument();
  });

  it("renders certifications, projects, languages, and credential links when populated", () => {
    const populatedMock = {
      ...INITIAL_MOCK_CANDIDATE,
      links: [{ id: "l1", label: "GitHub", url: "https://github.com" }],
      certifications: [
        {
          id: "c1",
          name: "AWS Certified Developer",
          issuingOrganization: "Amazon",
          credentialUrl: "https://aws.amazon.com",
          issueDate: "2024-01-01",
        },
      ],
      projects: [
        {
          id: "p1",
          name: "Project Alpha",
          description: "Fullstack App",
          projectUrl: "https://alpha.com",
        },
      ],
      languages: [
        {
          languageId: "lang1",
          languageName: "Espanhol",
          proficiency: "Avançado",
        },
      ],
    };

    renderWithQuery(<CandidateProfileView initialData={populatedMock} />);

    expect(screen.getByText("AWS Certified Developer")).toBeInTheDocument();
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText(/Espanhol —/i)).toBeInTheDocument();
  });
});
