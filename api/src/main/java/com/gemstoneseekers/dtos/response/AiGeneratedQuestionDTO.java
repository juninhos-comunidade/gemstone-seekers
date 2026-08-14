package com.gemstoneseekers.dtos.response;

import java.util.List;

public record AiGeneratedQuestionDTO(
    String statement,
    List<AiGeneratedOptionDTO> options
) {}
