package com.gemstoneseekers.dtos.response;

import java.util.List;
import java.util.UUID;

public record CandidateResponse(UUID id, UserResponse user, String phone, String summary,
        List<CandidateLinkResponse> links, List<ExperienceResponse> experiences, List<EducationResponse> educations,
        List<CertificationResponse> certifications, List<ProjectResponse> projects,
        List<CandidateLanguageResponse> languages) {
}
