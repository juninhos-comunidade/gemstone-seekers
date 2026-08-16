import { CandidateBadgeResponse } from "@/lib/types/badge";

export const MOCK_CANDIDATE_BADGES: CandidateBadgeResponse[] = [
  {
    badgeName: "React Specialist",
    description:
      "Demonstrou excelente domínio em ecossistema React, Hooks e gerenciamento de estado.",
    technologyName: "React",
    scoreAchieved: 92.5,
    earnedAt: "2026-07-15T14:30:00Z",
  },
  {
    badgeName: "Java Master",
    description:
      "Alcançou alta precisão em testes de Java e Orientação a Objetos.",
    technologyName: "Java",
    scoreAchieved: 95.0,
    earnedAt: "2026-06-20T10:15:00Z",
  },
  {
    badgeName: "TypeScript Professional",
    description:
      "Comprovou competência avançada em tipagem estática e arquitetura TypeScript.",
    technologyName: "TypeScript",
    scoreAchieved: 88.0,
    earnedAt: "2026-08-01T16:45:00Z",
  },
  {
    badgeName: "SQL & Relational Databases",
    description:
      "Superou o score mínimo exigido em modelagem de dados e consultas SQL.",
    technologyName: "PostgreSQL",
    scoreAchieved: 84.0,
    earnedAt: "2026-05-10T11:00:00Z",
  },
];

export const EMPTY_CANDIDATE_BADGES: CandidateBadgeResponse[] = [];
