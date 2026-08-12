package com.gemstoneseekers.dtos.response;

public record OptionResultResponse(
    Long id,
    String optionText,
    boolean isCorrect
) {}
