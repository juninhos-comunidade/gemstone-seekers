package com.gemstoneseekers.dtos.response;

import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.enums.AssessmentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record AssessmentDetailedResultResponse(UUID assessmentId, String technologyName, AssessmentStatus status,
        QuestionDifficulty difficulty, BigDecimal score, int totalQuestions, int correctAnswers, Instant completedAt,
        List<QuestionResultResponse> questions) {
}
