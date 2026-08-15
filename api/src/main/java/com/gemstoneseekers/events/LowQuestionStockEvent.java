package com.gemstoneseekers.events;

import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.models.Technology;

public record LowQuestionStockEvent(Technology technology, QuestionDifficulty difficulty) {
}
