package com.gemstoneseekers.dtos.response;

import com.gemstoneseekers.enums.TestStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TestResultResponse(
    UUID testId,
    String technologyName,
    TestStatus status,
    BigDecimal score,
    int totalQuestions,
    long correctAnswers,
    Instant completedAt
) {}
