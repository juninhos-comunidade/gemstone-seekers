package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.ai.AiGeneratedQuestionDTO;
import com.gemstoneseekers.dtos.ai.AiGeneratedOptionDTO;
import com.gemstoneseekers.dtos.ai.AiQuestionBatchResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.enums.QuestionSource;
import com.gemstoneseekers.models.Question;
import com.gemstoneseekers.models.QuestionOption;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.repositories.QuestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    private QuestionService questionService;

    @Captor
    private ArgumentCaptor<List<Question>> questionsCaptor;

    @BeforeEach
    void setUp() {
        questionService = new QuestionService(questionRepository);
    }

    @Test
    void shouldCorrectlyMapAndSaveAiGeneratedBatch() {

        Technology javaTech = new Technology();
        javaTech.setId(1);
        javaTech.setName("Java");

        AiGeneratedOptionDTO q1o1 = new AiGeneratedOptionDTO("Option 1.1", false);
        AiGeneratedOptionDTO q1o2 = new AiGeneratedOptionDTO("Option 1.2 (Correct)", true);
        AiGeneratedQuestionDTO q1 = new AiGeneratedQuestionDTO("What is a JVM?", List.of(q1o1, q1o2));

        AiGeneratedOptionDTO q2o1 = new AiGeneratedOptionDTO("Option 2.1 (Correct)", true);
        AiGeneratedQuestionDTO q2 = new AiGeneratedQuestionDTO("What is a JRE?", List.of(q2o1));

        AiQuestionBatchResponse aiResponse = new AiQuestionBatchResponse(List.of(q1, q2));

        questionService.saveAiGeneratedBatch(javaTech, QuestionDifficulty.BEGINNER, aiResponse);

        verify(questionRepository, times(1)).saveAll(questionsCaptor.capture());
        List<Question> savedQuestions = questionsCaptor.getValue();

        assertThat(savedQuestions).hasSize(2);

        Question savedQ1 = savedQuestions.get(0);
        assertThat(savedQ1.getStatement()).isEqualTo("What is a JVM?");
        assertThat(savedQ1.getTechnology()).isEqualTo(javaTech);
        assertThat(savedQ1.getDifficultyLevel()).isEqualTo(QuestionDifficulty.BEGINNER);
        assertThat(savedQ1.getSource()).isEqualTo(QuestionSource.AI_GENERATED);
        assertThat(savedQ1.getOptions()).hasSize(2);

        Optional<QuestionOption> savedQ1CorrectOption = savedQ1.getOptions().stream()
            .filter(QuestionOption::isCorrect)
            .findFirst();
        assertThat(savedQ1CorrectOption).isPresent();
        assertThat(savedQ1CorrectOption.get().getOptionText()).isEqualTo("Option 1.2 (Correct)");
        assertThat(savedQ1CorrectOption.get().getQuestion()).isEqualTo(savedQ1);

        Question savedQ2 = savedQuestions.get(1);
        assertThat(savedQ2.getStatement()).isEqualTo("What is a JRE?");
        assertThat(savedQ2.getOptions()).hasSize(1);
        assertThat(savedQ2.getOptions().stream().findFirst().get().isCorrect()).isTrue();
        assertThat(savedQ2.getOptions().stream().findFirst().get().getQuestion()).isEqualTo(savedQ2);
    }

    @Test
    void shouldHandleEmptyBatchWithoutErrors() {
        Technology javaTech = new Technology();
        javaTech.setId(1);
        javaTech.setName("Java");

        AiQuestionBatchResponse emptyResponse = new AiQuestionBatchResponse(Collections.emptyList());

        questionService.saveAiGeneratedBatch(javaTech, QuestionDifficulty.ADVANCED, emptyResponse);

        verify(questionRepository, times(1)).saveAll(questionsCaptor.capture());
        assertThat(questionsCaptor.getValue()).isEmpty();
    }

    @Test
    void shouldHandleQuestionWithNoOptions() {
        Technology pythonTech = new Technology();
        pythonTech.setId(2);
        pythonTech.setName("Python");

        AiGeneratedQuestionDTO questionWithNoOptions = new AiGeneratedQuestionDTO("What is duck typing?", Collections.emptyList());
        AiQuestionBatchResponse response = new AiQuestionBatchResponse(List.of(questionWithNoOptions));

        questionService.saveAiGeneratedBatch(pythonTech, QuestionDifficulty.INTERMEDIATE, response);

        verify(questionRepository, times(1)).saveAll(questionsCaptor.capture());
        List<Question> savedQuestions = questionsCaptor.getValue();

        assertThat(savedQuestions).hasSize(1);
        Question savedQuestion = savedQuestions.get(0);
        assertThat(savedQuestion.getStatement()).isEqualTo("What is duck typing?");
        assertThat(savedQuestion.getOptions()).isNotNull().isEmpty();
    }
}
