import { CandidateBadgeResponse } from "@/lib/types/badge";

export const MOCK_CANDIDATE_BADGES: CandidateBadgeResponse[] = [
  {
    id: 1,
    name: "React Specialist",
    description:
      "Demonstrou excelente domínio em ecossistema React, Hooks e gerenciamento de estado.",
    minimumScore: 80.0,
    technologyId: 1,
    technologyName: "React",
    technologyCategory: "Frontend",
    testId: "test-101",
    testScore: 92.5,
    earnedAt: "2026-07-15T14:30:00Z",
  },
  {
    id: 2,
    name: "Java Master",
    description:
      "Alcançou alta precisão em testes de Java e Orientação a Objetos.",
    minimumScore: 85.0,
    technologyId: 2,
    technologyName: "Java",
    technologyCategory: "Backend",
    testId: "test-102",
    testScore: 95.0,
    earnedAt: "2026-06-20T10:15:00Z",
  },
  {
    id: 3,
    name: "TypeScript Professional",
    description:
      "Comprovou competência avançada em tipagem estática e arquitetura TypeScript.",
    minimumScore: 75.0,
    technologyId: 3,
    technologyName: "TypeScript",
    technologyCategory: "Frontend",
    testId: "test-103",
    testScore: 88.0,
    earnedAt: "2026-08-01T16:45:00Z",
  },
  {
    id: 4,
    name: "SQL & Relational Databases",
    description:
      "Superou o score mínimo exigido em modelagem de dados e consultas SQL.",
    minimumScore: 70.0,
    technologyId: 4,
    technologyName: "PostgreSQL",
    technologyCategory: "Database",
    testId: "test-104",
    testScore: 84.0,
    earnedAt: "2026-05-10T11:00:00Z",
  },
];

export const EMPTY_CANDIDATE_BADGES: CandidateBadgeResponse[] = [];
