package com.gemstoneseekers.dtos.ai;

import java.util.List;

public record AiQuestionBatchResponse(
    List<AiGeneratedQuestionDTO> questions
) {}
