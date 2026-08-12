package com.gemstoneseekers.dtos.response;

import com.gemstoneseekers.enums.QuestionDifficulty;

import java.math.BigDecimal;
import java.util.List;

public record DifficultyHistoryGroupResponse(
    QuestionDifficulty difficulty,
    int testsCount,
    BigDecimal averageScore,
    List<TestSummaryResponse> tests
) {}
