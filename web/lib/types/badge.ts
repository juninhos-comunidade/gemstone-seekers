export interface Badge {
  id: number;
  technologyId?: number;
  name: string;
  description?: string;
  minimumScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CandidateBadge {
  candidateId: string;
  badgeId: number;
  testId?: string;
  earnedAt: string;
}

export interface CandidateBadgeResponse {
  id: number;
  name: string;
  description?: string;
  minimumScore?: number;
  technologyId?: number;
  technologyName?: string;
  technologyCategory?: string;
  testId?: string;
  testScore?: number;
  earnedAt: string;
}
