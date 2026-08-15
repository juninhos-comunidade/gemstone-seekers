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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.dao.DataAccessException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Profile("!test")
@Component
public class QuestionRefillWorker {

    private static final Logger log = LoggerFactory.getLogger(QuestionRefillWorker.class);
    private static final int MINIMUM_STOCK_THRESHOLD = 12;
    private static final int BATCH_SIZE = 10;
    private static final long RATE_LIMIT_DELAY_MS = 5000;

    private final TechnologyRepository technologyRepository;
    private final QuestionRepository questionRepository;
    private final QuestionService questionService;
    private final AiQuestionGeneratorService aiService;
    private final Sleeper sleeper;

    @FunctionalInterface
    public interface Sleeper {
        void sleep(long millis) throws InterruptedException;
    }

    @Component
    public static class DefaultSleeper implements Sleeper {
        @Override
        public void sleep(long millis) throws InterruptedException {
            Thread.sleep(millis);
        }
    }

    public QuestionRefillWorker(TechnologyRepository technologyRepository, QuestionRepository questionRepository,
                                QuestionService questionService, AiQuestionGeneratorService aiService, Sleeper sleeper) {
        this.technologyRepository = technologyRepository;
        this.questionRepository = questionRepository;
        this.questionService = questionService;
        this.aiService = aiService;
        this.sleeper = sleeper;
    }

    @Async
    @EventListener(ApplicationReadyEvent.class)
    @SuppressWarnings("PMD.AvoidCatchingGenericException")
    public void executeRefillJob() {
        if (log.isInfoEnabled()) {
            log.info("[WORKER] Starting Asynchronous Question Refill Job...");
        }

        List<Technology> technologies;
        Map<Integer, Map<QuestionDifficulty, Long>> stockMatrix;

        try {
            technologies = technologyRepository.findAll();
            if (technologies.isEmpty()) {
                log.info("[WORKER] No technologies found. Skipping job.");
                return;
            }

            List<StockProjection> stockReport = questionRepository.getQuestionStockReport();
            stockMatrix = stockReport.stream().collect(Collectors.groupingBy(
                StockProjection::getTechnologyId, Collectors.toMap(StockProjection::getDifficultyLevel,
                    StockProjection::getStockCount)));

        } catch (DataAccessException e) {
            if (log.isErrorEnabled()) {
                log.error("[WORKER] Fatal infrastructure failure fetching initial data. Job aborted.", e);
            }
            return;
        }

        boolean circuitOpen = false;

        for (Technology tech : technologies) {
            if (circuitOpen) {
                if (log.isWarnEnabled()) {
                    log.warn("[WORKER] Circuit is OPEN due to AI unavailability. Aborting refill (Skipping {}).", tech.getName());
                }
                break;
            }

            try {
                processTechnologyRefill(tech, stockMatrix);

            } catch (AiGenerationException e) {
                if (log.isErrorEnabled()) {
                    log.error("[WORKER] Systemic AI failure detected for {}. Opening circuit! Reason: {}", tech.getName(), e.getMessage());
                }
                circuitOpen = true;

            } catch (Exception e) {
                // Captura intencional para falhas não mapeadas (ex: NullPointer).
                // Evita que o job inteiro pare, permitindo que a próxima tecnologia seja processada.
                if (log.isErrorEnabled()) {
                    log.error("[WORKER] Unexpected logical error processing {}. Skipping to next technology.", tech.getName(), e);
                }
            }
        }

        log.info("[WORKER] Question Refill Job finished execution.");
    }

    private void processTechnologyRefill(Technology tech, Map<Integer, Map<QuestionDifficulty, Long>> stockMatrix) throws AiGenerationException {
        for (QuestionDifficulty difficulty : QuestionDifficulty.values()) {
            long currentStock = stockMatrix.getOrDefault(tech.getId(), Collections.emptyMap()).getOrDefault(
                difficulty, 0L);

            while (currentStock < MINIMUM_STOCK_THRESHOLD) {
                if (log.isWarnEnabled()) {
                    log.warn("[WORKER] Low stock for {} ({}). Current: {}. Target: {}. Triggering AI.", tech.getName(),
                        difficulty, currentStock, MINIMUM_STOCK_THRESHOLD);
                }

                AiQuestionBatchResponse aiResponse = aiService.generateQuestions(tech.getName(), difficulty, BATCH_SIZE);

                questionService.saveAiGeneratedBatch(tech, difficulty, aiResponse);

                if (log.isInfoEnabled()) {
                    log.info("[WORKER] Successfully generated and saved {} questions for {} ({}).", BATCH_SIZE, tech.getName(), difficulty);
                }

                currentStock += BATCH_SIZE;

                try {
                    sleeper.sleep(RATE_LIMIT_DELAY_MS);
                } catch (InterruptedException ie) {
                    if (log.isWarnEnabled()) {
                        log.warn("[WORKER] Sleep was interrupted! Halting execution for this technology.");
                    }
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }
    }
}
