package com.gemstoneseekers.dtos.response;

import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.enums.QuestionSource;

import java.util.List;

public record QuestionResponse(Long id, String statement, QuestionDifficulty difficultyLevel, QuestionSource source,
        List<QuestionOptionResponse> options

) {
}
