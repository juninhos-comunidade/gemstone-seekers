package com.gemstoneseekers.workers;

import com.gemstoneseekers.dtos.response.AiQuestionBatchResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
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

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

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

    @Test
    void shouldNotTriggerAiGenerationWhenStockIsSufficientForAllDifficulties() {
        Technology javaTech = new Technology();
        javaTech.setId(1);
        javaTech.setName("Java");

        when(technologyRepository.findAll()).thenReturn(List.of(javaTech));

        StockProjection beginnerStock = createMockProjection(1, QuestionDifficulty.BEGINNER, 12L);
        StockProjection intermediateStock = createMockProjection(1, QuestionDifficulty.INTERMEDIATE, 15L);
        StockProjection advancedStock = createMockProjection(1, QuestionDifficulty.ADVANCED, 20L);

        when(questionRepository.getQuestionStockReport())
                .thenReturn(List.of(beginnerStock, intermediateStock, advancedStock));

        worker.executeRefillJob();

        verify(aiService, never()).generateQuestions(anyString(), any(QuestionDifficulty.class), anyInt());
        verify(questionService, never()).saveAiGeneratedBatch(any(), any(), any());
    }

    private StockProjection createMockProjection(Integer techId, QuestionDifficulty difficulty, Long count) {
        StockProjection projection = mock(StockProjection.class);
        when(projection.getTechnologyId()).thenReturn(techId);
        when(projection.getDifficultyLevel()).thenReturn(difficulty);
        when(projection.getStockCount()).thenReturn(count);
        return projection;
    }

    @Test
    void shouldTriggerAiGenerationOnceWhenStockIsSlightlyBelowThreshold() throws InterruptedException {
        Technology javaTech = new Technology();
        javaTech.setId(1);
        javaTech.setName("Java");

        when(technologyRepository.findAll()).thenReturn(List.of(javaTech));

        StockProjection beginnerStock = createMockProjection(1, QuestionDifficulty.BEGINNER, 2L);
        StockProjection intermediateStock = createMockProjection(1, QuestionDifficulty.INTERMEDIATE, 15L);
        StockProjection advancedStock = createMockProjection(1, QuestionDifficulty.ADVANCED, 20L);

        when(questionRepository.getQuestionStockReport())
                .thenReturn(List.of(beginnerStock, intermediateStock, advancedStock));

        AiQuestionBatchResponse aiResponse = new AiQuestionBatchResponse(List.of());
        when(aiService.generateQuestions("Java", QuestionDifficulty.BEGINNER, 10)).thenReturn(aiResponse);

        worker.executeRefillJob();

        verify(aiService, times(1)).generateQuestions("Java", QuestionDifficulty.BEGINNER, 10);
        verify(questionService, times(1)).saveAiGeneratedBatch(javaTech, QuestionDifficulty.BEGINNER, aiResponse);

        verify(sleeper, times(1)).sleep(5000);
    }

    @Test
    void shouldTriggerAiGenerationMultipleTimesWhenStockIsZero() throws InterruptedException {
        Technology pythonTech = new Technology();
        pythonTech.setId(2);
        pythonTech.setName("Python");

        when(technologyRepository.findAll()).thenReturn(List.of(pythonTech));

        StockProjection beginnerStock = createMockProjection(2, QuestionDifficulty.BEGINNER, 0L);
        StockProjection intermediateStock = createMockProjection(2, QuestionDifficulty.INTERMEDIATE, 15L);
        StockProjection advancedStock = createMockProjection(2, QuestionDifficulty.ADVANCED, 15L);

        when(questionRepository.getQuestionStockReport())
                .thenReturn(List.of(beginnerStock, intermediateStock, advancedStock));

        AiQuestionBatchResponse aiResponse = new AiQuestionBatchResponse(List.of());
        when(aiService.generateQuestions("Python", QuestionDifficulty.BEGINNER, 10)).thenReturn(aiResponse);

        worker.executeRefillJob();

        verify(aiService, times(2)).generateQuestions("Python", QuestionDifficulty.BEGINNER, 10);
        verify(questionService, times(2)).saveAiGeneratedBatch(pythonTech, QuestionDifficulty.BEGINNER, aiResponse);

        verify(sleeper, times(2)).sleep(5000);
    }

    @Test
    void shouldHandleExceptionAndContinueToNextDifficultyWhenAiServiceFails() throws InterruptedException {
        Technology javaTech = new Technology();
        javaTech.setId(1);
        javaTech.setName("Java");

        when(technologyRepository.findAll()).thenReturn(List.of(javaTech));

        StockProjection beginnerStock = createMockProjection(1, QuestionDifficulty.BEGINNER, 0L);
        StockProjection intermediateStock = createMockProjection(1, QuestionDifficulty.INTERMEDIATE, 0L);
        StockProjection advancedStock = createMockProjection(1, QuestionDifficulty.ADVANCED, 15L);

        when(questionRepository.getQuestionStockReport())
                .thenReturn(List.of(beginnerStock, intermediateStock, advancedStock));

        when(aiService.generateQuestions("Java", QuestionDifficulty.BEGINNER, 10))
                .thenThrow(new org.springframework.ai.retry.TransientAiException("API Limit Exceeded"));
        AiQuestionBatchResponse aiResponse = new AiQuestionBatchResponse(List.of());
        when(aiService.generateQuestions("Java", QuestionDifficulty.INTERMEDIATE, 10)).thenReturn(aiResponse);

        worker.executeRefillJob();

        verify(aiService, times(1)).generateQuestions("Java", QuestionDifficulty.BEGINNER, 10);
        verify(questionService, never()).saveAiGeneratedBatch(eq(javaTech), eq(QuestionDifficulty.BEGINNER), any());

        verify(aiService, times(2)).generateQuestions("Java", QuestionDifficulty.INTERMEDIATE, 10);
        verify(questionService, times(2)).saveAiGeneratedBatch(javaTech, QuestionDifficulty.INTERMEDIATE, aiResponse);

        verify(sleeper, times(2)).sleep(5000);
    }

    @Test
    void shouldRestoreInterruptFlagAndBreakWhenSleepIsInterrupted() throws InterruptedException {
        Technology javaTech = new Technology();
        javaTech.setId(1);
        javaTech.setName("Java");

        when(technologyRepository.findAll()).thenReturn(List.of(javaTech));

        StockProjection beginnerStock = createMockProjection(1, QuestionDifficulty.BEGINNER, 0L);
        StockProjection intermediateStock = createMockProjection(1, QuestionDifficulty.INTERMEDIATE, 15L);
        StockProjection advancedStock = createMockProjection(1, QuestionDifficulty.ADVANCED, 15L);

        when(questionRepository.getQuestionStockReport())
                .thenReturn(List.of(beginnerStock, intermediateStock, advancedStock));

        AiQuestionBatchResponse aiResponse = new AiQuestionBatchResponse(List.of());
        when(aiService.generateQuestions("Java", QuestionDifficulty.BEGINNER, 10)).thenReturn(aiResponse);

        doThrow(new InterruptedException()).when(sleeper).sleep(5000);

        worker.executeRefillJob();

        verify(aiService, times(1)).generateQuestions("Java", QuestionDifficulty.BEGINNER, 10);
        verify(questionService, times(1)).saveAiGeneratedBatch(javaTech, QuestionDifficulty.BEGINNER, aiResponse);

        assertThat(Thread.currentThread().isInterrupted()).isTrue();

        Thread.interrupted();
    }

    @Test
    void shouldHandleExceptionAndContinueToNextDifficultyWhenQuestionServiceFails() throws InterruptedException {
        Technology javaTech = new Technology();
        javaTech.setId(1);
        javaTech.setName("Java");

        when(technologyRepository.findAll()).thenReturn(List.of(javaTech));

        StockProjection beginnerStock = createMockProjection(1, QuestionDifficulty.BEGINNER, 0L);
        StockProjection intermediateStock = createMockProjection(1, QuestionDifficulty.INTERMEDIATE, 0L);
        StockProjection advancedStock = createMockProjection(1, QuestionDifficulty.ADVANCED, 15L);

        when(questionRepository.getQuestionStockReport())
                .thenReturn(List.of(beginnerStock, intermediateStock, advancedStock));

        AiQuestionBatchResponse aiResponse = new AiQuestionBatchResponse(List.of());
        when(aiService.generateQuestions("Java", QuestionDifficulty.BEGINNER, 10)).thenReturn(aiResponse);
        when(aiService.generateQuestions("Java", QuestionDifficulty.INTERMEDIATE, 10)).thenReturn(aiResponse);

        // Ajustado para refletir o DataAccessException estrito
        doThrow(new org.springframework.dao.DataAccessResourceFailureException("Database connection lost"))
                .when(questionService).saveAiGeneratedBatch(eq(javaTech), eq(QuestionDifficulty.BEGINNER), any());

        worker.executeRefillJob();

        verify(aiService, times(1)).generateQuestions("Java", QuestionDifficulty.BEGINNER, 10);
        verify(questionService, times(1)).saveAiGeneratedBatch(eq(javaTech), eq(QuestionDifficulty.BEGINNER), any());

        verify(aiService, times(2)).generateQuestions("Java", QuestionDifficulty.INTERMEDIATE, 10);
        verify(questionService, times(2)).saveAiGeneratedBatch(javaTech, QuestionDifficulty.INTERMEDIATE, aiResponse);

        verify(sleeper, times(2)).sleep(5000);
    }

    @Test
    void shouldNotTriggerAnyActionWhenNoTechnologiesAreFound() {
        when(technologyRepository.findAll()).thenReturn(List.of());

        worker.executeRefillJob();

        verify(questionRepository, never()).getQuestionStockReport();
        verify(aiService, never()).generateQuestions(anyString(), any(QuestionDifficulty.class), anyInt());
        verify(questionService, never()).saveAiGeneratedBatch(any(), any(), any());
    }

    @Test
    void shouldTreatEmptyStockReportAsZeroAndTriggerAiGeneration() throws InterruptedException {
        Technology javaTech = new Technology();
        javaTech.setId(1);
        javaTech.setName("Java");

        when(technologyRepository.findAll()).thenReturn(List.of(javaTech));
        when(questionRepository.getQuestionStockReport()).thenReturn(List.of());

        AiQuestionBatchResponse aiResponse = new AiQuestionBatchResponse(List.of());
        when(aiService.generateQuestions(anyString(), any(QuestionDifficulty.class), anyInt())).thenReturn(aiResponse);

        worker.executeRefillJob();

        verify(aiService, times(2)).generateQuestions("Java", QuestionDifficulty.BEGINNER, 10);
        verify(questionService, times(2)).saveAiGeneratedBatch(javaTech, QuestionDifficulty.BEGINNER, aiResponse);

        verify(aiService, times(2)).generateQuestions("Java", QuestionDifficulty.INTERMEDIATE, 10);
        verify(questionService, times(2)).saveAiGeneratedBatch(javaTech, QuestionDifficulty.INTERMEDIATE, aiResponse);

        verify(aiService, times(2)).generateQuestions("Java", QuestionDifficulty.ADVANCED, 10);
        verify(questionService, times(2)).saveAiGeneratedBatch(javaTech, QuestionDifficulty.ADVANCED, aiResponse);

        verify(sleeper, times(6)).sleep(5000);
    }
}
