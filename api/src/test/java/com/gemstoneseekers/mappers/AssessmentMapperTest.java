package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.response.QuestionResponse;
import com.gemstoneseekers.dtos.response.AssessmentDetailedResultResponse;
import com.gemstoneseekers.dtos.response.AssessmentResponse;
import com.gemstoneseekers.dtos.response.AssessmentResultResponse;
import com.gemstoneseekers.dtos.response.AssessmentSummaryResponse;
import com.gemstoneseekers.dtos.response.TechnologyResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.enums.QuestionSource;
import com.gemstoneseekers.enums.AssessmentStatus;
import com.gemstoneseekers.models.CandidateAnswer;
import com.gemstoneseekers.models.Question;
import com.gemstoneseekers.models.QuestionOption;
import com.gemstoneseekers.models.Technology;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TestMapperTest {

    @Mock
    private TechnologyMapper technologyMapper;

    @Mock
    private QuestionMapper questionMapper;

    @InjectMocks
    private AssessmentMapper assessmentMapper;

    @Test
    void toAssessmentAndQuestionsResponseShouldMapTechnologyStatusAndQuestionsWhenAnswersArePresent() {
        Technology technology = technology(7, "Java", "Backend");
        Question question1 = question(1L, "Question 1", QuestionDifficulty.BEGINNER, QuestionSource.INTERNAL);
        Question question2 = question(2L, "Question 2", QuestionDifficulty.INTERMEDIATE, QuestionSource.AI_GENERATED);
        QuestionResponse response1 = new QuestionResponse(1L, "Question 1", QuestionDifficulty.BEGINNER,
                QuestionSource.INTERNAL, List.of());
        QuestionResponse response2 = new QuestionResponse(2L, "Question 2", QuestionDifficulty.INTERMEDIATE,
                QuestionSource.AI_GENERATED, List.of());
        com.gemstoneseekers.models.Assessment test = assessmentWithAnswers(technology, AssessmentStatus.IN_PROGRESS,
                linkedAnswers(answer(question1), answer(question2)));
        TechnologyResponse technologyResponse = new TechnologyResponse(7, "Java", "Backend");

        when(technologyMapper.toTechnologyResponse(technology)).thenReturn(technologyResponse);
        when(questionMapper.toResponse(question1)).thenReturn(response1);
        when(questionMapper.toResponse(question2)).thenReturn(response2);

        AssessmentResponse result = assessmentMapper.toAssessmentAndQuestionsResponse(test);

        assertThat(result.id()).isEqualTo(test.getId());
        assertThat(result.technologyResponse()).isEqualTo(technologyResponse);
        assertThat(result.status()).isEqualTo(AssessmentStatus.IN_PROGRESS);
        assertThat(result.questions()).containsExactly(response1, response2);
        verify(technologyMapper).toTechnologyResponse(technology);
        verify(questionMapper).toResponse(question1);
        verify(questionMapper).toResponse(question2);
    }

    @Test
    void toAssessmentAndQuestionsResponseShouldReturnEmptyQuestionsWhenAnswersAreNull() {
        Technology technology = technology(7, "Java", "Backend");
        com.gemstoneseekers.models.Assessment test = assessmentWithAnswers(technology, AssessmentStatus.IN_PROGRESS,
                null);
        TechnologyResponse technologyResponse = new TechnologyResponse(7, "Java", "Backend");

        when(technologyMapper.toTechnologyResponse(technology)).thenReturn(technologyResponse);

        AssessmentResponse result = assessmentMapper.toAssessmentAndQuestionsResponse(test);

        assertThat(result.id()).isEqualTo(test.getId());
        assertThat(result.technologyResponse()).isEqualTo(technologyResponse);
        assertThat(result.status()).isEqualTo(AssessmentStatus.IN_PROGRESS);
        assertThat(result.questions()).isEmpty();
        verify(technologyMapper).toTechnologyResponse(technology);
        verify(questionMapper, never()).toResponse(any(Question.class));
    }

    @Test
    void toAssessmentResultResponseShouldReturnNullWhenTestIsNull() {
        assertThat(assessmentMapper.toAssessmentResultResponse(null)).isNull();
    }

    @Test
    void toAssessmentResultResponseShouldCountCorrectAnswersAndIgnoreNullSelections() {
        Technology technology = technology(7, "Java", "Backend");
        Question question = question(1L, "Question 1", QuestionDifficulty.BEGINNER, QuestionSource.INTERNAL);
        QuestionOption correctOption = option(11L, "Correct", true);
        QuestionOption wrongOption = option(12L, "Wrong", false);
        QuestionOption selectedCorrect = option(11L, "Correct", true);
        QuestionOption selectedWrong = option(12L, "Wrong", false);

        question.setOptions(Set.of(correctOption, wrongOption));

        CandidateAnswer correctAnswer = answer(question);
        correctAnswer.setSelectedOption(selectedCorrect);

        CandidateAnswer wrongAnswer = answer(question);
        wrongAnswer.setSelectedOption(selectedWrong);

        CandidateAnswer unanswered = answer(question);

        com.gemstoneseekers.models.Assessment test = assessmentWithAnswers(technology, AssessmentStatus.COMPLETED,
                linkedAnswers(correctAnswer, wrongAnswer, unanswered));
        test.setScore(new BigDecimal("6.50"));
        test.setCompletedAt(Instant.parse("2026-08-13T21:00:00Z"));

        AssessmentResultResponse result = assessmentMapper.toAssessmentResultResponse(test);

        assertThat(result.assessmentId()).isEqualTo(test.getId());
        assertThat(result.technologyName()).isEqualTo("Java");
        assertThat(result.status()).isEqualTo(AssessmentStatus.COMPLETED);
        assertThat(result.score()).isEqualTo(new BigDecimal("6.50"));
        assertThat(result.totalQuestions()).isEqualTo(3);
        assertThat(result.correctAnswers()).isEqualTo(1);
        assertThat(result.completedAt()).isEqualTo(test.getCompletedAt());
    }

    @Test
    void toSummaryResponseShouldReturnNullWhenTestIsNull() {
        assertThat(assessmentMapper.toSummaryResponse(null)).isNull();
    }

    @Test
    void toSummaryResponseShouldDeriveDifficultyFromFirstAnswer() {
        Technology technology = technology(7, "Java", "Backend");
        Question firstQuestion = question(1L, "Question 1", QuestionDifficulty.INTERMEDIATE, QuestionSource.INTERNAL);
        Question secondQuestion = question(2L, "Question 2", QuestionDifficulty.ADVANCED, QuestionSource.AI_GENERATED);
        com.gemstoneseekers.models.Assessment test = assessmentWithAnswers(technology, AssessmentStatus.IN_PROGRESS,
                linkedAnswers(answer(firstQuestion), answer(secondQuestion)));
        test.setScore(new BigDecimal("7.50"));
        test.setCreatedAt(Instant.parse("2026-08-13T20:00:00Z"));
        test.setCompletedAt(Instant.parse("2026-08-13T21:00:00Z"));

        AssessmentSummaryResponse result = assessmentMapper.toSummaryResponse(test);

        assertThat(result.assessmentId()).isEqualTo(test.getId());
        assertThat(result.status()).isEqualTo(AssessmentStatus.IN_PROGRESS);
        assertThat(result.difficulty()).isEqualTo(QuestionDifficulty.INTERMEDIATE);
        assertThat(result.score()).isEqualTo(new BigDecimal("7.50"));
        assertThat(result.createdAt()).isEqualTo(test.getCreatedAt());
        assertThat(result.completedAt()).isEqualTo(test.getCompletedAt());
    }

    @Test
    void toDetailedResultResponseShouldReturnNullWhenTestIsNull() {
        assertThat(assessmentMapper.toDetailedResultResponse(null)).isNull();
    }

    @Test
    void toDetailedResultResponseShouldMapQuestionsOptionsAndCorrectAnswers() {
        Technology technology = technology(7, "Java", "Backend");

        Question question1 = question(1L, "Question 1", QuestionDifficulty.BEGINNER, QuestionSource.INTERNAL);
        QuestionOption q1Correct = option(11L, "Q1 Correct", true);
        QuestionOption q1Wrong = option(12L, "Q1 Wrong", false);
        question1.setOptions(linkedOptions(q1Correct, q1Wrong));

        Question question2 = question(2L, "Question 2", QuestionDifficulty.INTERMEDIATE, QuestionSource.AI_GENERATED);
        QuestionOption q2Correct = option(21L, "Q2 Correct", true);
        QuestionOption q2Wrong = option(22L, "Q2 Wrong", false);
        question2.setOptions(linkedOptions(q2Correct, q2Wrong));

        Question question3 = question(3L, "Question 3", QuestionDifficulty.ADVANCED, QuestionSource.INTERNAL);
        QuestionOption q3Correct = option(31L, "Q3 Correct", true);
        QuestionOption q3Wrong = option(32L, "Q3 Wrong", false);
        question3.setOptions(linkedOptions(q3Correct, q3Wrong));

        CandidateAnswer correctAnswer = answer(question1);
        correctAnswer.setSelectedOption(q1Correct);

        CandidateAnswer wrongAnswer = answer(question2);
        wrongAnswer.setSelectedOption(q2Wrong);

        CandidateAnswer unanswered = answer(question3);

        com.gemstoneseekers.models.Assessment test = assessmentWithAnswers(technology, AssessmentStatus.COMPLETED,
                linkedAnswers(correctAnswer, wrongAnswer, unanswered));
        test.setScore(new BigDecimal("8.00"));
        test.setCompletedAt(Instant.parse("2026-08-13T21:00:00Z"));

        AssessmentDetailedResultResponse result = assessmentMapper.toDetailedResultResponse(test);

        assertThat(result.assessmentId()).isEqualTo(test.getId());
        assertThat(result.technologyName()).isEqualTo("Java");
        assertThat(result.status()).isEqualTo(AssessmentStatus.COMPLETED);
        assertThat(result.difficulty()).isEqualTo(QuestionDifficulty.BEGINNER);
        assertThat(result.score()).isEqualTo(new BigDecimal("8.00"));
        assertThat(result.totalQuestions()).isEqualTo(3);
        assertThat(result.correctAnswers()).isEqualTo(1);
        assertThat(result.completedAt()).isEqualTo(test.getCompletedAt());
        assertThat(result.questions()).extracting(q -> q.questionId(), q -> q.selectedOptionId(), q -> q
                .correctOptionId(), q -> q.isCorrect()).containsExactly(org.assertj.core.groups.Tuple.tuple(1L, 11L,
                        11L, true), org.assertj.core.groups.Tuple.tuple(2L, 22L, 21L, false),
                        org.assertj.core.groups.Tuple.tuple(3L, null, 31L, false));
        assertThat(result.questions().get(0).options()).containsExactly(
                new com.gemstoneseekers.dtos.response.OptionResultResponse(11L, "Q1 Correct", true),
                new com.gemstoneseekers.dtos.response.OptionResultResponse(12L, "Q1 Wrong", false));
    }

    private com.gemstoneseekers.models.Assessment assessmentWithAnswers(Technology technology, AssessmentStatus status,
            Set<CandidateAnswer> answers) {
        com.gemstoneseekers.models.Assessment test = new com.gemstoneseekers.models.Assessment();
        test.setId(UUID.fromString("00000000-0000-0000-0000-000000000001"));
        test.setTechnology(technology);
        test.setStatus(status);
        test.setAnswers(answers);
        return test;
    }

    private Technology technology(Integer id, String name, String category) {
        Technology technology = new Technology();
        technology.setId(id);
        technology.setName(name);
        technology.setCategory(category);
        return technology;
    }

    private Question question(Long id, String statement, QuestionDifficulty difficulty, QuestionSource source) {
        Question question = new Question();
        question.setId(id);
        question.setStatement(statement);
        question.setDifficultyLevel(difficulty);
        question.setSource(source);
        question.setOptions(new LinkedHashSet<>());
        return question;
    }

    private QuestionOption option(Long id, String text, boolean correct) {
        QuestionOption option = new QuestionOption();
        option.setId(id);
        option.setOptionText(text);
        option.setCorrect(correct);
        return option;
    }

    private CandidateAnswer answer(Question question) {
        CandidateAnswer answer = new CandidateAnswer();
        answer.setQuestion(question);
        return answer;
    }

    private LinkedHashSet<CandidateAnswer> linkedAnswers(CandidateAnswer... answers) {
        LinkedHashSet<CandidateAnswer> result = new LinkedHashSet<>();
        for (CandidateAnswer answer : answers) {
            result.add(answer);
        }
        return result;
    }

    private LinkedHashSet<QuestionOption> linkedOptions(QuestionOption... options) {
        LinkedHashSet<QuestionOption> result = new LinkedHashSet<>();
        for (QuestionOption option : options) {
            result.add(option);
        }
        return result;
    }
}
