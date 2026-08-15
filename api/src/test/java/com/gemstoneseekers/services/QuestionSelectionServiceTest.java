package com.gemstoneseekers.services;

import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.events.LowQuestionStockEvent;
import com.gemstoneseekers.exceptions.InsufficientQuestionsException;
import com.gemstoneseekers.models.Question;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.models.User;
import com.gemstoneseekers.repositories.QuestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestionSelectionServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    private QuestionSelectionService service;

    private User user;
    private Technology technology;

    @BeforeEach
    void setUp() {
        service = new QuestionSelectionService(questionRepository, eventPublisher);

        user = new User();
        user.setId(UUID.randomUUID());

        technology = new Technology();
        technology.setId(1);
        technology.setName("Java");
    }

    @Test
    void shouldReturnTenUnseenQuestionsWhenStockIsSufficient() {
        List<Question> mockQuestions = generateMockQuestions(10);
        when(questionRepository.findRandomUnseenQuestions(user.getId(), technology.getId(),
                QuestionDifficulty.INTERMEDIATE.name(), 10)).thenReturn(mockQuestions);

        List<Question> result = service.generateTestQuestions(user, technology, QuestionDifficulty.INTERMEDIATE);

        assertThat(result).hasSize(10);
        assertThat(result).containsExactlyInAnyOrderElementsOf(mockQuestions);
        verify(questionRepository, never()).findRandomSeenQuestions(any(), any(), any(), anyInt());
        verify(eventPublisher, never()).publishEvent(any());
    }

    private List<Question> generateMockQuestions(int amount) {
        List<Question> questions = new ArrayList<>();
        for (int i = 0; i < amount; i++) {
            Question question = new Question();
            question.setId((long) (i + 1));
            questions.add(question);
        }
        return questions;
    }

    @Test
    void shouldThrowExceptionAndPublishEventWhenUnseenQuestionsAreLessThanThree() {
        List<Question> mockQuestions = generateMockQuestions(2);
        when(questionRepository.findRandomUnseenQuestions(user.getId(), technology.getId(),
                QuestionDifficulty.ADVANCED.name(), 10)).thenReturn(mockQuestions);

        assertThatThrownBy(() -> service.generateTestQuestions(user, technology, QuestionDifficulty.ADVANCED))
                .isInstanceOf(InsufficientQuestionsException.class)
                .hasMessage("Estamos gerando questões inéditas para você! Aguarde alguns instantes e tente novamente.");

        ArgumentCaptor<LowQuestionStockEvent> eventCaptor = ArgumentCaptor.forClass(LowQuestionStockEvent.class);
        verify(eventPublisher).publishEvent(eventCaptor.capture());
        verify(questionRepository, never()).findRandomSeenQuestions(any(), any(), any(), anyInt());

        LowQuestionStockEvent publishedEvent = eventCaptor.getValue();
        assertThat(publishedEvent.technology()).isEqualTo(technology);
        assertThat(publishedEvent.difficulty()).isEqualTo(QuestionDifficulty.ADVANCED);
    }

    @Test
    void shouldFetchSeenQuestionsAndPublishEventWhenUnseenQuestionsAreLessThanSix() {
        List<Question> unseenMockQuestions = generateMockQuestions(4);

        List<Question> seenMockQuestions = new ArrayList<>();
        for (int i = 0; i < 6; i++) {
            Question question = new Question();
            question.setId((long) (i + 100));
            seenMockQuestions.add(question);
        }

        when(questionRepository.findRandomUnseenQuestions(user.getId(), technology.getId(),
                QuestionDifficulty.BEGINNER.name(), 10)).thenReturn(unseenMockQuestions);
        when(questionRepository.findRandomSeenQuestions(user.getId(), technology.getId(),
                QuestionDifficulty.BEGINNER.name(), 6)).thenReturn(seenMockQuestions);

        List<Question> result = service.generateTestQuestions(user, technology, QuestionDifficulty.BEGINNER);

        assertThat(result).hasSize(10);
        assertThat(result).containsAll(unseenMockQuestions);
        assertThat(result).containsAll(seenMockQuestions);

        ArgumentCaptor<LowQuestionStockEvent> eventCaptor = ArgumentCaptor.forClass(LowQuestionStockEvent.class);
        verify(eventPublisher).publishEvent(eventCaptor.capture());

        LowQuestionStockEvent publishedEvent = eventCaptor.getValue();
        assertThat(publishedEvent.technology()).isEqualTo(technology);
        assertThat(publishedEvent.difficulty()).isEqualTo(QuestionDifficulty.BEGINNER);
    }
    @Test
    void shouldThrowExceptionAndPublishEventTwiceWhenSeenQuestionsAreInsufficient() {
        List<Question> unseenMockQuestions = generateMockQuestions(4);
        List<Question> seenMockQuestions = generateMockQuestions(5);

        when(questionRepository.findRandomUnseenQuestions(user.getId(), technology.getId(),
                QuestionDifficulty.INTERMEDIATE.name(), 10)).thenReturn(unseenMockQuestions);
        when(questionRepository.findRandomSeenQuestions(user.getId(), technology.getId(),
                QuestionDifficulty.INTERMEDIATE.name(), 6)).thenReturn(seenMockQuestions);

        assertThatThrownBy(() -> service.generateTestQuestions(user, technology, QuestionDifficulty.INTERMEDIATE))
                .isInstanceOf(InsufficientQuestionsException.class)
                .hasMessage("O acervo global ainda está sendo populado. Tente em breve.");

        verify(eventPublisher, times(2)).publishEvent(any(LowQuestionStockEvent.class));
    }

    @Test
    void shouldFetchSeenQuestionsSilentlyWhenUnseenQuestionsAreBetweenSixAndNine() {
        List<Question> unseenMockQuestions = generateMockQuestions(8);
        List<Question> seenMockQuestions = new ArrayList<>();
        for (int i = 0; i < 2; i++) {
            Question question = new Question();
            question.setId((long) (i + 100));
            seenMockQuestions.add(question);
        }

        when(questionRepository.findRandomUnseenQuestions(user.getId(), technology.getId(),
                QuestionDifficulty.ADVANCED.name(), 10)).thenReturn(unseenMockQuestions);
        when(questionRepository.findRandomSeenQuestions(user.getId(), technology.getId(),
                QuestionDifficulty.ADVANCED.name(), 2)).thenReturn(seenMockQuestions);

        List<Question> result = service.generateTestQuestions(user, technology, QuestionDifficulty.ADVANCED);

        assertThat(result).hasSize(10);
        assertThat(result).containsAll(unseenMockQuestions);
        assertThat(result).containsAll(seenMockQuestions);

        verify(eventPublisher, never()).publishEvent(any());
    }
}
