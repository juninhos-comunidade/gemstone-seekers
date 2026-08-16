package com.gemstoneseekers.listeners;

import com.gemstoneseekers.events.AssessmentCompletedEvent;
import com.gemstoneseekers.services.BadgeApplicationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class BadgeAssessmentEventListener {

    private static final Logger log = LoggerFactory.getLogger(BadgeAssessmentEventListener.class);
    private final BadgeApplicationService badgeApplicationService;

    public BadgeAssessmentEventListener(BadgeApplicationService badgeApplicationService) {
        this.badgeApplicationService = badgeApplicationService;
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleAssessmentCompleted(AssessmentCompletedEvent event) {
        if (log.isDebugEnabled()) {
            log.debug("[EVENT] Processing AssessmentCompletedEvent for candidate: {}", event.candidateId());
        }

        try {
            badgeApplicationService.evaluateAndAssignBadge(event.candidateId(), event.technologyId(), event
                    .assessmentId(), event.finalScore(), event.difficulty());
        } catch (org.springframework.dao.DataAccessException | IllegalArgumentException | IllegalStateException e) {
            if (log.isErrorEnabled()) {
                log.error("[EVENT] Failed to process badge assignment for candidate {}. Reason: {}", event
                        .candidateId(), e.getMessage(), e);
            }
        }
    }
}
