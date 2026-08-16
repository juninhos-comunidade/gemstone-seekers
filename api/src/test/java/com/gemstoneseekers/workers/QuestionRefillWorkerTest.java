package com.gemstoneseekers.workers;

import com.gemstoneseekers.dtos.response.AiQuestionBatchResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.exceptions.AiGenerationException;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.projections.StockProjection;
import com.gemstoneseekers.repositories.QuestionRepository;
import com.gemstoneseekers.repositories.TechnologyRepository;
import com.gemstoneseekers.services.AiQuestionGeneratorService;
import com.gemstoneseekers.services.QuestionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuestionRefillWorkerTest {

    @Mock
    private TechnologyRepository technologyRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private QuestionService questionService;

    @Mock
    private AiQuestionGeneratorService aiService;

    @Mock
    private QuestionRefillWorker.Sleeper sleeper;

    private QuestionRefillWorker worker;

    @BeforeEach
    void setUp() {
        worker = new QuestionRefillWorker(technologyRepository, questionRepository, questionService, aiService,
                sleeper);
    }

    private StockProjection createMockProjection(Integer techId, QuestionDifficulty difficulty, Long count) {
        StockProjection projection = mock(StockProjection.class);
        when(projection.getTechnologyId()).thenReturn(techId);
        when(projection.getDifficultyLevel()).thenReturn(difficulty);
        when(projection.getStockCount()).thenReturn(count);
        return projection;
    }

    @Test
    void shouldNotTriggerAnyActionWhenNoTechnologiesAreFound() {
        when(technologyRepository.findAll()).thenReturn(List.of());
        worker.executeRefillJob();
        verify(questionRepository, never()).getQuestionStockReport();
        verify(aiService, never()).generateQuestions(anyString(), any(QuestionDifficulty.class), anyInt());
    }

    @Test
    void shouldNotTriggerAiGenerationWhenStockIsSufficient() {
        Technology javaTech = new Technology();
        javaTech.setId(1);
        javaTech.setName("Java");
        when(technologyRepository.findAll()).thenReturn(List.of(javaTech));
        StockProjection beginner = createMockProjection(1, QuestionDifficulty.BEGINNER, 15L);
        StockProjection intermediate = createMockProjection(1, QuestionDifficulty.INTERMEDIATE, 20L);
        StockProjection advanced = createMockProjection(1, QuestionDifficulty.ADVANCED, 12L);
        when(questionRepository.getQuestionStockReport()).thenReturn(List.of(beginner, intermediate, advanced));

        worker.executeRefillJob();

        verify(aiService, never()).generateQuestions(anyString(), any(QuestionDifficulty.class), anyInt());
    }

    @Test
    void shouldTriggerAiGenerationUntilStockThresholdIsMet() throws InterruptedException {
        Technology pythonTech = new Technology();
        pythonTech.setId(2);
        pythonTech.setName("Python");
        when(technologyRepository.findAll()).thenReturn(List.of(pythonTech));
        StockProjection beginner = createMockProjection(2, QuestionDifficulty.BEGINNER, 0L);
        StockProjection intermediate = createMockProjection(2, QuestionDifficulty.INTERMEDIATE, 20L);
        StockProjection advanced = createMockProjection(2, QuestionDifficulty.ADVANCED, 12L);
        when(questionRepository.getQuestionStockReport()).thenReturn(List.of(beginner, intermediate, advanced));
        AiQuestionBatchResponse aiResponse = new AiQuestionBatchResponse(List.of());
        when(aiService.generateQuestions("Python", QuestionDifficulty.BEGINNER, 12)).thenReturn(aiResponse);

        worker.executeRefillJob();

        verify(aiService, times(1)).generateQuestions("Python", QuestionDifficulty.BEGINNER, 12);
        verify(questionService, times(1)).saveAiGeneratedBatch(pythonTech, QuestionDifficulty.BEGINNER, aiResponse);
        verify(sleeper, times(1)).sleep(5000);
        verify(aiService, never()).generateQuestions("Python", QuestionDifficulty.INTERMEDIATE, 10);
        verify(aiService, never()).generateQuestions("Python", QuestionDifficulty.ADVANCED, 10);
    }

    @Test
    void shouldOpenCircuitAndStopProcessingOnAiFailure() {
        Technology javaTech = new Technology();
        javaTech.setId(1);
        javaTech.setName("Java");
        Technology pythonTech = new Technology();
        pythonTech.setId(2);
        pythonTech.setName("Python");
        when(technologyRepository.findAll()).thenReturn(List.of(javaTech, pythonTech));
        StockProjection javaStock = createMockProjection(1, QuestionDifficulty.BEGINNER, 0L);
        when(questionRepository.getQuestionStockReport()).thenReturn(List.of(javaStock));
        when(aiService.generateQuestions("Java", QuestionDifficulty.BEGINNER, 12)).thenThrow(new AiGenerationException(
                "AI quota exceeded"));

        assertDoesNotThrow(() -> worker.executeRefillJob());

        verify(aiService, times(1)).generateQuestions("Java", QuestionDifficulty.BEGINNER, 12);
        verify(aiService, never()).generateQuestions("Python", QuestionDifficulty.BEGINNER, 10);
        verify(questionService, never()).saveAiGeneratedBatch(any(), any(), any());
    }

    @Test
    void shouldStopProcessingForATechnologyOnDatabaseFailure() throws InterruptedException {
        Technology javaTech = new Technology();
        javaTech.setId(1);
        javaTech.setName("Java");
        when(technologyRepository.findAll()).thenReturn(List.of(javaTech));
        StockProjection stock = createMockProjection(1, QuestionDifficulty.BEGINNER, 0L);
        when(questionRepository.getQuestionStockReport()).thenReturn(List.of(stock));
        AiQuestionBatchResponse aiResponse = new AiQuestionBatchResponse(List.of());
        when(aiService.generateQuestions("Java", QuestionDifficulty.BEGINNER, 12)).thenReturn(aiResponse);
        doThrow(new DataAccessException("DB connection lost") {
        }).when(questionService).saveAiGeneratedBatch(any(), any(), any());

        assertDoesNotThrow(() -> worker.executeRefillJob());

        verify(aiService, times(1)).generateQuestions("Java", QuestionDifficulty.BEGINNER, 12);
        verify(questionService, times(1)).saveAiGeneratedBatch(any(), any(), any());
        verify(sleeper, never()).sleep(anyInt());
    }

    @Test
    void shouldStopAndRestoreInterruptFlagWhenSleeperIsInterrupted() throws InterruptedException {
        Technology javaTech = new Technology();
        javaTech.setId(1);
        javaTech.setName("Java");
        when(technologyRepository.findAll()).thenReturn(List.of(javaTech));
        StockProjection stock = createMockProjection(1, QuestionDifficulty.BEGINNER, 0L);
        when(questionRepository.getQuestionStockReport()).thenReturn(List.of(stock));
        AiQuestionBatchResponse aiResponse = new AiQuestionBatchResponse(List.of());
        when(aiService.generateQuestions("Java", QuestionDifficulty.BEGINNER, 12)).thenReturn(aiResponse);
        doThrow(new InterruptedException()).when(sleeper).sleep(5000);

        worker.executeRefillJob();

        verify(aiService, times(1)).generateQuestions("Java", QuestionDifficulty.BEGINNER, 12);
        verify(questionService, times(1)).saveAiGeneratedBatch(any(), any(), any());
        assertThat(Thread.currentThread().isInterrupted()).isTrue();
        Thread.interrupted();
    }
}
