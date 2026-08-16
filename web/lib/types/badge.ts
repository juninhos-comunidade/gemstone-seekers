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
  badgeName: string;
  technologyName?: string;
  description?: string;
  scoreAchieved?: number;
  earnedAt: string;
}
