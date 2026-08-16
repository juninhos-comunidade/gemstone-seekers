package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.response.AiGeneratedOptionDTO;
import com.gemstoneseekers.dtos.response.AiGeneratedQuestionDTO;
import com.gemstoneseekers.dtos.response.AiQuestionBatchResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.exceptions.AiGenerationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Answers;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.retry.TransientAiException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiQuestionGeneratorServiceTest {

    private AiQuestionGeneratorService aiQuestionGeneratorService;

    @Mock
    private ChatClient.Builder chatClientBuilder;

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private ChatClient chatClient;

    @Captor
    private ArgumentCaptor<String> promptCaptor;

    @BeforeEach
    void setUp() {
        when(chatClientBuilder.build()).thenReturn(chatClient);
        aiQuestionGeneratorService = new AiQuestionGeneratorService(chatClientBuilder);
    }

    @Test
    @DisplayName("generateQuestions should return questions on successful API call")
    void generateQuestions_onSuccess_shouldReturnQuestions() {
        // given
        String technologyName = "Java";
        QuestionDifficulty difficulty = QuestionDifficulty.INTERMEDIATE;
        int amount = 2;
        String jsonResponse = """
                {
                    "questions": [
                        {
                            "statement": "What is a lambda expression in Java?",
                            "options": [
                                { "optionText": "An anonymous function", "isCorrect": true },
                                { "optionText": "A class constructor", "isCorrect": false },
                                { "optionText": "A static method", "isCorrect": false },
                                { "optionText": "An interface", "isCorrect": false }
                            ]
                        }
                    ]
                }
                """;

        // A captura do argumento é feita aqui, dentro do when()
        when(chatClient.prompt().user(promptCaptor.capture()).call().content()).thenReturn(jsonResponse);

        // when
        AiQuestionBatchResponse result = aiQuestionGeneratorService.generateQuestions(technologyName, difficulty, amount);

        // then
        // A verificação é feita no valor capturado, sem usar verify() para a captura.
        String capturedPrompt = promptCaptor.getValue();
        assertThat(capturedPrompt).contains("gerar 2 questões")
                                  .contains("'Java'")
                                  .contains("'INTERMEDIATE'");

        assertThat(result).isNotNull();
        assertThat(result.questions()).hasSize(1);
        AiGeneratedQuestionDTO question = result.questions().get(0);
        assertThat(question.statement()).isEqualTo("What is a lambda expression in Java?");
        assertThat(question.options()).hasSize(4);
        assertThat(question.options()).contains(new AiGeneratedOptionDTO("An anonymous function", true));
    }

    @ParameterizedTest
    @NullSource
    @ValueSource(strings = {"", "  "})
    @DisplayName("generateQuestions should throw AiGenerationException for null or blank response")
    void generateQuestions_whenResponseIsNullOrBlank_shouldThrowException(String apiResponse) {
        // given
        when(chatClient.prompt().user(anyString()).call().content()).thenReturn(apiResponse);

        // when & then
        assertThatThrownBy(() -> aiQuestionGeneratorService.generateQuestions("Java", QuestionDifficulty.BEGINNER, 1))
                .isInstanceOf(AiGenerationException.class)
                .hasMessage("A API retornou um payload nulo ou vazio.");
    }

    @Test
    @DisplayName("generateQuestions should wrap AI exceptions in AiGenerationException")
    void generateQuestions_whenAiApiFails_shouldWrapException() {
        // given
        when(chatClient.prompt().user(anyString()).call()).thenThrow(new TransientAiException("API is unavailable"));

        // when & then
        assertThatThrownBy(() -> aiQuestionGeneratorService.generateQuestions("Java", QuestionDifficulty.BEGINNER, 1))
                .isInstanceOf(AiGenerationException.class)
                .hasMessage("AI content generation failed due to upstream error.")
                .hasCauseInstanceOf(TransientAiException.class);
    }
}
