package com.gemstoneseekers.dtos.response;

import com.gemstoneseekers.enums.AssessmentStatus;

import java.util.List;
import java.util.UUID;

public record AssessmentResponse(UUID id, TechnologyResponse technologyResponse, AssessmentStatus status,
        List<QuestionResponse> questions

) {
}
