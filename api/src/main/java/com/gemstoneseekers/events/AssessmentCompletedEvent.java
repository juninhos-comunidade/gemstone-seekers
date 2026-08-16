package com.gemstoneseekers.events;

import com.gemstoneseekers.enums.QuestionDifficulty;

import java.math.BigDecimal;
import java.util.UUID;

public record AssessmentCompletedEvent(UUID candidateId, Integer technologyId, UUID assessmentId,
                                       BigDecimal finalScore, QuestionDifficulty difficulty) {
}
