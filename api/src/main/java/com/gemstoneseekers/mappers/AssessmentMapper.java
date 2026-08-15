package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.response.OptionResultResponse;
import com.gemstoneseekers.dtos.response.QuestionResultResponse;
import com.gemstoneseekers.dtos.response.AssessmentDetailedResultResponse;
import com.gemstoneseekers.dtos.response.AssessmentResponse;
import com.gemstoneseekers.dtos.response.AssessmentResultResponse;
import com.gemstoneseekers.dtos.response.AssessmentSummaryResponse;
import com.gemstoneseekers.dtos.response.QuestionResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.models.CandidateAnswer;
import com.gemstoneseekers.models.Question;
import com.gemstoneseekers.models.QuestionOption;
import com.gemstoneseekers.models.Assessment;
import org.springframework.stereotype.Component;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component
public class AssessmentMapper {

    private final TechnologyMapper technologyMapper;
    private final QuestionMapper questionMapper;

    public AssessmentMapper(TechnologyMapper technologyMapper, QuestionMapper questionMapper) {
        this.technologyMapper = technologyMapper;
        this.questionMapper = questionMapper;
    }

    public AssessmentResponse toAssessmentAndQuestionsResponse(Assessment assessment) {
        List<QuestionResponse> questions = Optional.ofNullable(assessment.getAnswers()).orElseGet(Collections::emptySet)
                .stream().map(CandidateAnswer::getQuestion).map(questionMapper::toResponse).toList();

        return new AssessmentResponse(assessment.getId(), technologyMapper.toTechnologyResponse(assessment
                .getTechnology()), assessment.getStatus(), questions

        );
    }
    public AssessmentResultResponse toAssessmentResultResponse(Assessment assessment) {
        if (assessment == null) {
            return null;
        }

        long correctAnswers = assessment.getAnswers() == null ? 0 : assessment.getAnswers().stream().filter(a -> a
                .getSelectedOption() != null && a.getSelectedOption().isCorrect()).count();

        int totalCount = assessment.getAnswers() == null ? 0 : assessment.getAnswers().size();

        return new AssessmentResultResponse(assessment.getId(), assessment.getTechnology().getName(), assessment
                .getStatus(), assessment.getScore(), totalCount, correctAnswers, assessment.getCompletedAt());
    }

    public AssessmentSummaryResponse toSummaryResponse(Assessment assessment) {
        if (assessment == null) {
            return null;
        }

        QuestionDifficulty derivedDifficulty = assessment.getAnswers().stream().map(CandidateAnswer::getQuestion).map(
                Question::getDifficultyLevel).findFirst().orElse(null);

        return new AssessmentSummaryResponse(assessment.getId(), assessment.getStatus(), derivedDifficulty, assessment
                .getScore(), assessment.getCreatedAt(), assessment.getCompletedAt());
    }

    public AssessmentDetailedResultResponse toDetailedResultResponse(Assessment assessment) {
        if (assessment == null) {
            return null;
        }

        List<QuestionResultResponse> questions = assessment.getAnswers().stream().map(answer -> {

            QuestionOption correctOption = answer.getQuestion().getOptions().stream().filter(QuestionOption::isCorrect)
                    .findFirst().orElse(null);

            Long correctOptionId = correctOption != null ? correctOption.getId() : null;
            Long selectedOptionId = answer.getSelectedOption() != null ? answer.getSelectedOption().getId() : null;
            boolean isCorrect = selectedOptionId != null && selectedOptionId.equals(correctOptionId);

            List<OptionResultResponse> mappedOptions = answer.getQuestion().getOptions().stream().map(
                    opt -> new OptionResultResponse(opt.getId(), opt.getOptionText(), opt.isCorrect())).toList();

            return new QuestionResultResponse(answer.getQuestion().getId(), answer.getQuestion().getStatement(),
                    selectedOptionId, correctOptionId, isCorrect, mappedOptions);
        }).toList();

        long correctAnswersCount = questions.stream().filter(QuestionResultResponse::isCorrect).count();

        return new AssessmentDetailedResultResponse(assessment.getId(), assessment.getTechnology().getName(), assessment
                .getStatus(), assessment.getDerivedDifficulty(), assessment.getScore(), questions.size(),
                (int) correctAnswersCount, assessment.getCompletedAt(), questions);
    }
}
