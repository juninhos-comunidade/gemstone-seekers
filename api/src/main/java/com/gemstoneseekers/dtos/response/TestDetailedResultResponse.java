package com.gemstoneseekers.dtos.response;

import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.enums.TestStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record TestDetailedResultResponse(UUID testId, String technologyName, TestStatus status,
        QuestionDifficulty difficulty, BigDecimal score, int totalQuestions, int correctAnswers, Instant completedAt,
        List<QuestionResultResponse> questions) {
}
