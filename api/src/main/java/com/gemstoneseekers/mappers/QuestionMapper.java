package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.response.QuestionOptionResponse;
import com.gemstoneseekers.dtos.response.QuestionResponse;
import com.gemstoneseekers.models.Question;
import org.springframework.stereotype.Component;

@Component
public class QuestionMapper {

    public QuestionResponse toResponse(Question question) {
        return new QuestionResponse(question.getId(), question.getStatement(), question.getDifficultyLevel(), question
                .getSource(), question.getOptions().stream().map(option -> new QuestionOptionResponse(option.getId(),
                        option.getOptionText())).toList());
    }
}
