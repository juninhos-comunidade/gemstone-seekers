import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CandidateProfileView } from "@/components/Profile/CandidateProfileView";
import {
  INITIAL_MOCK_CANDIDATE,
  EMPTY_CANDIDATE_MOCK,
} from "@/lib/mocks/candidateMock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CandidateProfileResponse } from "@/lib/types/candidate";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/lib/api/location/location", () => ({
  useStatesQuery: () => ({
    data: [{ id: 10, name: "São Paulo", countryId: 1 }],
    isLoading: false,
  }),
  useCountriesQuery: () => ({
    data: [{ id: 1, name: "Brasil", codeAlpha2: "BR" }],
    isLoading: false,
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

  it("renders profile header and section placeholders when optional candidate fields are empty", () => {
    renderWithQuery(
      <CandidateProfileView initialData={EMPTY_CANDIDATE_MOCK} />,
    );

    expect(screen.getByText("Novo Candidato")).toBeInTheDocument();
    expect(
      screen.getByText("Nenhum resumo informado ainda."),
    ).toBeInTheDocument();
    expect(screen.getByText("Endereço não cadastrado.")).toBeInTheDocument();
  });

  it("renders certifications, projects, languages, and credential links when populated", () => {
    const populatedMock: CandidateProfileResponse = {
      ...INITIAL_MOCK_CANDIDATE,
      candidate: {
        ...INITIAL_MOCK_CANDIDATE.candidate,
        links: [{ id: "l1", name: "GitHub", url: "https://github.com" }],
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
            languageId: 1,
            languageName: "Espanhol",
            proficiency: "ADVANCED",
          },
        ],
      },
    };

    renderWithQuery(<CandidateProfileView initialData={populatedMock} />);

    expect(screen.getByText("AWS Certified Developer")).toBeInTheDocument();
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText(/Espanhol —/i)).toBeInTheDocument();
  });
});
