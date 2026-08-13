package com.gemstoneseekers.dtos.ai;

import java.util.List;

public record AiGeneratedQuestionDTO(
    String statement,
    List<AiGeneratedOptionDTO> options
) {}
