package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.response.OptionResultResponse;
import com.gemstoneseekers.dtos.response.QuestionResultResponse;
import com.gemstoneseekers.dtos.response.TestDetailedResultResponse;
import com.gemstoneseekers.dtos.response.TestResponse;
import com.gemstoneseekers.dtos.response.TestResultResponse;
import com.gemstoneseekers.dtos.response.TestSummaryResponse;
import com.gemstoneseekers.dtos.response.QuestionResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.models.CandidateAnswer;
import com.gemstoneseekers.models.Question;
import com.gemstoneseekers.models.QuestionOption;
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

    public TestResponse toTestAndQuestionsResponse(Test test) {
        List<QuestionResponse> questions = Optional.ofNullable(test.getAnswers()).orElseGet(Collections::emptySet)
                .stream().map(CandidateAnswer::getQuestion).map(questionMapper::toResponse).toList();

        return new TestResponse(test.getId(), technologyMapper.toTechnologyResponse(test.getTechnology()),
                test.getStatus(), questions

        );
    }
    public TestResultResponse toTestResultResponse(Test test) {
        if (test == null) {
            return null;
        }

        long correctAnswers = test.getAnswers() == null
                ? 0
                : test.getAnswers().stream()
                        .filter(a -> a.getSelectedOption() != null && a.getSelectedOption().isCorrect()).count();

        int totalCount = test.getAnswers() == null ? 0 : test.getAnswers().size();

        return new TestResultResponse(test.getId(), test.getTechnology().getName(), test.getStatus(), test.getScore(),
                totalCount, correctAnswers, test.getCompletedAt());
    }

    public TestSummaryResponse toSummaryResponse(Test test) {
        if (test == null) {
            return null;
        }

        QuestionDifficulty derivedDifficulty = test.getAnswers().stream().map(CandidateAnswer::getQuestion)
                .map(Question::getDifficultyLevel).findFirst().orElse(null);

        return new TestSummaryResponse(test.getId(), test.getStatus(), derivedDifficulty, test.getScore(),
                test.getCreatedAt(), test.getCompletedAt());
    }

    public TestDetailedResultResponse toDetailedResultResponse(Test test) {
        if (test == null) {
            return null;
        }

        List<QuestionResultResponse> questions = test.getAnswers().stream().map(answer -> {

            QuestionOption correctOption = answer.getQuestion().getOptions().stream().filter(QuestionOption::isCorrect)
                    .findFirst().orElse(null);

            Long correctOptionId = correctOption != null ? correctOption.getId() : null;
            Long selectedOptionId = answer.getSelectedOption() != null ? answer.getSelectedOption().getId() : null;
            boolean isCorrect = selectedOptionId != null && selectedOptionId.equals(correctOptionId);

            List<OptionResultResponse> mappedOptions = answer.getQuestion().getOptions().stream()
                    .map(opt -> new OptionResultResponse(opt.getId(), opt.getOptionText(), opt.isCorrect())).toList();

            return new QuestionResultResponse(answer.getQuestion().getId(), answer.getQuestion().getStatement(),
                    selectedOptionId, correctOptionId, isCorrect, mappedOptions);
        }).toList();

        long correctAnswersCount = questions.stream().filter(QuestionResultResponse::isCorrect).count();

        return new TestDetailedResultResponse(test.getId(), test.getTechnology().getName(), test.getStatus(),
                test.getDerivedDifficulty(), test.getScore(), questions.size(), (int) correctAnswersCount,
                test.getCompletedAt(), questions);
    }
}
