package com.gemstoneseekers.dtos.request;

import jakarta.validation.constraints.NotNull;

public record SaveAnswerRequest(
    @NotNull(message = "Question ID is required")
    Long questionId,

    @NotNull(message = "Selected option ID is required")
    Long selectedOptionId
) {}
