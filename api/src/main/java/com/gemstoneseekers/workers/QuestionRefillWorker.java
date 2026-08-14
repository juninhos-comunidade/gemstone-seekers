package com.gemstoneseekers.workers;

import com.gemstoneseekers.dtos.response.AiQuestionBatchResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.projections.StockProjection;
import com.gemstoneseekers.repositories.QuestionRepository;
import com.gemstoneseekers.repositories.TechnologyRepository;
import com.gemstoneseekers.services.AiQuestionGeneratorService;
import com.gemstoneseekers.services.QuestionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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


    public QuestionRefillWorker(
        TechnologyRepository technologyRepository,
        QuestionRepository questionRepository,
        QuestionService questionService,
        AiQuestionGeneratorService aiService,
        Sleeper sleeper
    ) {
        this.technologyRepository = technologyRepository;
        this.questionRepository = questionRepository;
        this.questionService = questionService;
        this.aiService = aiService;
        this.sleeper = sleeper;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void executeRefillJob() {
        if (log.isInfoEnabled()) {
            log.info("[WORKER] Starting Question Refill Job...");
        }

        List<Technology> technologies = technologyRepository.findAll();

        if (technologies.isEmpty()) {
            if (log.isInfoEnabled()) {
                log.info("[WORKER] No technologies found. Skipping job.");
            }
            return;
        }

        List<StockProjection> stockReport = questionRepository.getQuestionStockReport();

        Map<Integer, Map<QuestionDifficulty, Long>> stockMatrix = stockReport.stream()
            .collect(Collectors.groupingBy(
                StockProjection::getTechnologyId,
                Collectors.toMap(
                    StockProjection::getDifficultyLevel,
                    StockProjection::getStockCount
                )
            ));

        for (Technology tech : technologies) {
            for (QuestionDifficulty difficulty : QuestionDifficulty.values()) {
                long currentStock = stockMatrix
                    .getOrDefault(tech.getId(), Collections.emptyMap())
                    .getOrDefault(difficulty, 0L);

                refillDifficultyStock(tech, difficulty, currentStock);
            }
        }
    }


    private void refillDifficultyStock(Technology tech, QuestionDifficulty difficulty, long initialStock) {
        long currentStock = initialStock;

        while (currentStock < MINIMUM_STOCK_THRESHOLD) {
            if (log.isWarnEnabled()) {
                log.warn("[WORKER] Low stock for {} ({}). Current: {}. Target: {}. Triggering AI.",
                    tech.getName(), difficulty, currentStock, MINIMUM_STOCK_THRESHOLD);
            }

            try {
                AiQuestionBatchResponse aiResponse = aiService.generateQuestions(
                    tech.getName(), difficulty, BATCH_SIZE
                );

                questionService.saveAiGeneratedBatch(tech, difficulty, aiResponse);

                if (log.isInfoEnabled()) {
                    log.info("[WORKER] Successfully generated and saved {} questions for {} ({}).",
                        BATCH_SIZE, tech.getName(), difficulty);
                }

                currentStock += BATCH_SIZE;

                if (log.isInfoEnabled()) {
                    log.info("[WORKER] Sleeping to respect API rate limits...");
                }
                sleeper.sleep(RATE_LIMIT_DELAY_MS);

            } catch (InterruptedException ie) {
                if (log.isWarnEnabled()) {
                    log.warn("[WORKER] Sleep was interrupted!");
                }
                Thread.currentThread().interrupt();
                break;
            } catch (org.springframework.ai.retry.NonTransientAiException
                     | org.springframework.ai.retry.TransientAiException
                     | org.springframework.dao.DataAccessException e) {
                if (log.isErrorEnabled()) {
                    log.error("[WORKER] Failed to generate or save questions for {} ({})",
                        tech.getName(), difficulty, e);
                }
                break;
            }
        }
    }
}
