package com.gemstoneseekers.dtos.response;

import com.gemstoneseekers.enums.AssessmentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record AssessmentResultResponse(UUID assessmentId, String technologyName, AssessmentStatus status,
        BigDecimal score, int totalQuestions, long correctAnswers, Instant completedAt) {
}
