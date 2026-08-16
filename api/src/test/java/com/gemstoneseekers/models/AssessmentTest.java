package com.gemstoneseekers.models;

import com.gemstoneseekers.enums.AssessmentStatus;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.exceptions.BusinessRuleException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AssessmentTest {

    private Assessment assessment;

    @BeforeEach
    void setUp() {
        assessment = new Assessment();
        assessment.setId(UUID.randomUUID());
        assessment.setStatus(AssessmentStatus.IN_PROGRESS);
    }

    @Nested
    @DisplayName("submit()")
    class Submit {

        @Test
        @DisplayName("should change status to COMPLETED and set completedAt")
        void whenInProgress_shouldCompleteAssessment() {
            // when
            assessment.submit();

            // then
            assertThat(assessment.getStatus()).isEqualTo(AssessmentStatus.COMPLETED);
            assertThat(assessment.getCompletedAt()).isNotNull();
        }

        @Test
        @DisplayName("should throw BusinessRuleException if assessment is not IN_PROGRESS")
        void whenNotInProgress_shouldThrowException() {
            // given
            assessment.setStatus(AssessmentStatus.COMPLETED);

            // when & then
            assertThatThrownBy(() -> assessment.submit())
                    .isInstanceOf(BusinessRuleException.class)
                    .hasMessage("Only assessments in progress can be submitted");
        }

        @Test
        @DisplayName("should calculate score")
        void shouldCalculateScore() {
            // given
            Set<CandidateAnswer> answers = new HashSet<>();
            answers.add(createAnswer(1L, true));
            answers.add(createAnswer(2L, false));
            assessment.setAnswers(answers);

            // when
            assessment.submit();

            // then
            assertThat(assessment.getScore()).isEqualTo(new BigDecimal("5.00"));
        }
    }

    @Nested
    @DisplayName("calculateScore()")
    class CalculateScore {

        @Test
        @DisplayName("should return 0.00 for no answers")
        void whenNoAnswers_shouldReturnZero() {
            // given
            assessment.setAnswers(Collections.emptySet());

            // when
            assessment.submit();

            // then
            assertThat(assessment.getScore()).isEqualTo(new BigDecimal("0.00"));
        }

        @Test
        @DisplayName("should return 10.00 for all correct answers")
        void whenAllCorrect_shouldReturnMaxScore() {
            // given
            Set<CandidateAnswer> answers = new HashSet<>();
            answers.add(createAnswer(1L, true));
            answers.add(createAnswer(2L, true));
            assessment.setAnswers(answers);

            // when
            assessment.submit();

            // then
            assertThat(assessment.getScore()).isEqualTo(new BigDecimal("10.00"));
        }

        @Test
        @DisplayName("should return 0.00 for all incorrect answers")
        void whenAllIncorrect_shouldReturnZero() {
            // given
            Set<CandidateAnswer> answers = new HashSet<>();
            answers.add(createAnswer(1L, false));
            answers.add(createAnswer(2L, false));
            assessment.setAnswers(answers);

            // when
            assessment.submit();

            // then
            assertThat(assessment.getScore()).isEqualTo(new BigDecimal("0.00"));
        }

        @Test
        @DisplayName("should return 3.33 for one correct out of three")
        void whenOneOfThreeCorrect_shouldCalculateProportionally() {
            // given
            Set<CandidateAnswer> answers = new HashSet<>();
            answers.add(createAnswer(1L, true));
            answers.add(createAnswer(2L, false));
            answers.add(createAnswer(3L, false));
            assessment.setAnswers(answers);

            // when
            assessment.submit();

            // then
            assertThat(assessment.getScore()).isEqualTo(new BigDecimal("3.33"));
        }
    }

    @Nested
    @DisplayName("answerQuestion()")
    class AnswerQuestion {

        @Test
        @DisplayName("should set the selected option for a valid question")
        void whenQuestionIsValid_shouldSetSelectedOption() {
            // given
            CandidateAnswer answer = createAnswer(1L, false);
            assessment.addAnswer(answer);
            QuestionOption newOption = new QuestionOption();
            newOption.setId(2L);

            // when
            assessment.answerQuestion(1L, newOption);

            // then
            assertThat(answer.getSelectedOption()).isEqualTo(newOption);
        }

        @Test
        @DisplayName("should throw BusinessRuleException for an invalid question")
        void whenQuestionIsInvalid_shouldThrowException() {
            // given
            CandidateAnswer answer = createAnswer(1L, false);
            assessment.addAnswer(answer);
            QuestionOption newOption = new QuestionOption();
            newOption.setId(2L);

            // when & then
            assertThatThrownBy(() -> assessment.answerQuestion(99L, newOption))
                    .isInstanceOf(BusinessRuleException.class)
                    .hasMessageContaining("Question ID 99 does not belong to Assessment ID");
        }
    }

    @Nested
    @DisplayName("getDerivedDifficulty()")
    class GetDerivedDifficulty {

        @Test
        @DisplayName("should return BEGINNER when answers are null")
        void whenAnswersAreNull_shouldReturnBeginner() {
            // given
            assessment.setAnswers(null);

            // when
            QuestionDifficulty difficulty = assessment.getDerivedDifficulty();

            // then
            assertThat(difficulty).isEqualTo(QuestionDifficulty.BEGINNER);
        }

        @Test
        @DisplayName("should return BEGINNER when answers are empty")
        void whenAnswersAreEmpty_shouldReturnBeginner() {
            // given
            assessment.setAnswers(Collections.emptySet());

            // when
            QuestionDifficulty difficulty = assessment.getDerivedDifficulty();

            // then
            assertThat(difficulty).isEqualTo(QuestionDifficulty.BEGINNER);
        }

        @Test
        @DisplayName("should return difficulty of the first question")
        void whenHasAnswers_shouldReturnFirstQuestionDifficulty() {
            // given
            Set<CandidateAnswer> answers = new LinkedHashSet<>();
            answers.add(createAnswerWithDifficulty(1L, QuestionDifficulty.INTERMEDIATE));
            answers.add(createAnswerWithDifficulty(2L, QuestionDifficulty.ADVANCED));
            assessment.setAnswers(answers);

            // when
            QuestionDifficulty difficulty = assessment.getDerivedDifficulty();

            // then
            assertThat(difficulty).isEqualTo(QuestionDifficulty.INTERMEDIATE);
        }
    }

    private CandidateAnswer createAnswer(Long questionId, boolean isCorrect) {
        Question question = new Question();
        question.setId(questionId);
        QuestionOption option = new QuestionOption();
        option.setCorrect(isCorrect);
        CandidateAnswer answer = new CandidateAnswer();
        answer.setQuestion(question);
        answer.setSelectedOption(option);
        return answer;
    }

    private CandidateAnswer createAnswerWithDifficulty(Long questionId, QuestionDifficulty difficulty) {
        Question question = new Question();
        question.setId(questionId);
        question.setDifficultyLevel(difficulty);
        CandidateAnswer answer = new CandidateAnswer();
        answer.setQuestion(question);
        return answer;
    }
}
