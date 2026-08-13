package com.gemstoneseekers.workers;

import com.gemstoneseekers.dtos.ai.AiQuestionBatchResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.repositories.QuestionRepository;
import com.gemstoneseekers.repositories.TechnologyRepository;
import com.gemstoneseekers.services.AiQuestionGeneratorService;
import com.gemstoneseekers.services.QuestionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
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

    private final TechnologyRepository technologyRepository;
    private final QuestionRepository questionRepository;
    private final QuestionService questionService;
    private final AiQuestionGeneratorService aiService;

    public QuestionRefillWorker(TechnologyRepository technologyRepository, QuestionRepository questionRepository, QuestionService questionService, AiQuestionGeneratorService aiService) {
        this.technologyRepository = technologyRepository;
        this.questionRepository = questionRepository;
        this.questionService = questionService;
        this.aiService = aiService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void executeRefillJob() {
        log.info("[WORKER] Starting Question Refill Job...");

        List<Technology> technologies = technologyRepository.findAll();

        List<QuestionRepository.StockProjection> stockReport = questionRepository.getQuestionStockReport();


        Map<Integer, Map<QuestionDifficulty, Long>> stockMatrix = stockReport.stream()
            .collect(Collectors.groupingBy(
                QuestionRepository.StockProjection::getTechnologyId,
                Collectors.toMap(
                    QuestionRepository.StockProjection::getDifficultyLevel,
                    QuestionRepository.StockProjection::getStockCount
                )
            ));

        for (Technology tech : technologies) {
            for (QuestionDifficulty difficulty : QuestionDifficulty.values()) {

                long currentStock = stockMatrix
                    .getOrDefault(tech.getId(), Collections.emptyMap())
                    .getOrDefault(difficulty, 0L);

                while (currentStock < MINIMUM_STOCK_THRESHOLD) {
                    log.warn("[WORKER] Low stock for {} ({}). Current: {}. Target: {}. Triggering AI.",
                        tech.getName(), difficulty, currentStock, MINIMUM_STOCK_THRESHOLD);

                    try {
                        AiQuestionBatchResponse aiResponse = aiService.generateQuestions(
                            tech.getName(), difficulty, BATCH_SIZE
                        );

                        questionService.saveAiGeneratedBatch(tech, difficulty, aiResponse);

                        log.info("[WORKER] Successfully generated and saved {} questions for {} ({}).",
                            BATCH_SIZE, tech.getName(), difficulty);

                        currentStock += BATCH_SIZE;

                        log.info("[WORKER] Sleeping for 5 seconds to respect API rate limits...");
                        Thread.sleep(5000);

                    } catch (InterruptedException ie) {
                        log.warn("[WORKER] Sleep was interrupted!");
                        Thread.currentThread().interrupt();
                        break;
                    } catch (Exception e) {
                        log.error("[WORKER] Failed to generate questions for {} ({})",
                            tech.getName(), difficulty, e);
                        break;
                    }
                }
            }
        }
    }
}
