package com.gemstoneseekers.dtos.response;

import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.enums.AssessmentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record AssessmentSummaryResponse(UUID assessmentId, AssessmentStatus status, QuestionDifficulty difficulty,
        BigDecimal score, Instant createdAt, Instant completedAt) {
}
