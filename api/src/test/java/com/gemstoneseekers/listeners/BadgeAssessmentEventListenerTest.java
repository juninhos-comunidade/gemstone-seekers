package com.gemstoneseekers.listeners;

import com.gemstoneseekers.events.AssessmentCompletedEvent;
import com.gemstoneseekers.services.BadgeApplicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessResourceFailureException;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class BadgeAssessmentEventListenerTest {

    @Mock
    private BadgeApplicationService badgeApplicationService;

    @InjectMocks
    private BadgeAssessmentEventListener listener;

    private AssessmentCompletedEvent event;

    @BeforeEach
    void setUp() {
        UUID candidateId = UUID.randomUUID();
        Integer technologyId = 1;
        UUID assessmentId = UUID.randomUUID();
        BigDecimal finalScore = new BigDecimal("85.50");
        event = new AssessmentCompletedEvent(candidateId, technologyId, assessmentId, finalScore);
    }

    @Test
    @DisplayName("Should call badge application service when assessment is completed")
    void handleAssessmentCompleted_shouldCallBadgeApplicationService() {
        // when
        listener.handleAssessmentCompleted(event);

        // then
        verify(badgeApplicationService).evaluateAndAssignBadge(
                event.candidateId(),
                event.technologyId(),
                event.assessmentId(),
                event.finalScore()
        );
    }

    @ParameterizedTest
    @MethodSource("exceptionProvider")
    @DisplayName("Should handle exceptions from badge service and not propagate them")
    void handleAssessmentCompleted_shouldHandleExceptions(RuntimeException exception) {
        // given
        doThrow(exception).when(badgeApplicationService).evaluateAndAssignBadge(
                any(UUID.class), any(Integer.class), any(UUID.class), any(BigDecimal.class)
        );

        // when & then
        assertThatCode(() -> listener.handleAssessmentCompleted(event))
                .doesNotThrowAnyException();
    }

    private static Stream<RuntimeException> exceptionProvider() {
        return Stream.of(
                new DataAccessResourceFailureException("Database is down"),
                new IllegalArgumentException("Invalid argument"),
                new IllegalStateException("Invalid state")
        );
    }
}
