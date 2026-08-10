package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.response.QuestionResponse;
import com.gemstoneseekers.dtos.response.TestResponse;
import com.gemstoneseekers.dtos.response.TestResultResponse;
import com.gemstoneseekers.models.CandidateAnswer;
import com.gemstoneseekers.models.Test;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component
public class TestMapper {

    private final TechnologyMapper technologyMapper;
    private final QuestionMapper questionMapper;

    public TestMapper(TechnologyMapper technologyMapper, QuestionMapper questionMapper) {
        this.technologyMapper = technologyMapper;
        this.questionMapper = questionMapper;
    }

    public TestResponse toTestAndQuestionsResponse(Test test){
        List<QuestionResponse> questions = Optional.ofNullable(test.getAnswers())
            .orElseGet(Collections::emptySet)
            .stream()
            .map(CandidateAnswer::getQuestion)
            .map(questionMapper::toResponse)
            .toList();

        return new TestResponse(
            test.getId(),
            technologyMapper.toTechnologyResponse(test.getTechnology()),
            test.getStatus(),
            questions

        );
    }
    public TestResultResponse toTestResultResponse(Test test) {
        if (test == null) {
            return null;
        }

        long correctAnswers = test.getAnswers() == null ? 0 :
            test.getAnswers().stream()
                .filter(a -> a.getSelectedOption() != null && a.getSelectedOption().isCorrect())
                .count();

        int totalCount = test.getAnswers() == null ? 0 : test.getAnswers().size();

        return new TestResultResponse(
            test.getId(),
            test.getTechnology().getName(),
            test.getStatus(),
            test.getScore(),
            totalCount,
            correctAnswers,
            test.getCompletedAt()
        );
    }

}
