package com.gemstoneseekers.dtos.response;

import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.enums.TestStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TestSummaryResponse(
    UUID testId,
    TestStatus status,
    QuestionDifficulty difficulty,
    BigDecimal score,
    Instant createdAt,
    Instant completedAt
) {}
