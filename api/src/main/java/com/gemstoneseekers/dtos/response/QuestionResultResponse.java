package com.gemstoneseekers.dtos.response;

import java.util.List;

public record QuestionResultResponse(
    Long questionId,
    String statement,
    Long selectedOptionId,
    Long correctOptionId,
    boolean isCorrect,
    List<OptionResultResponse> options
) {}
