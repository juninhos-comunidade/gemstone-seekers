package com.gemstoneseekers.dtos.response;

import java.util.List;

public record AiQuestionBatchResponse(
    List<AiGeneratedQuestionDTO> questions
) {}
