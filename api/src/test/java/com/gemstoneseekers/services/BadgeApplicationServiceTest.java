package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.response.AvailableBadgeResponse;
import com.gemstoneseekers.dtos.response.CandidateBadgeResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.mappers.BadgeMapper;
import com.gemstoneseekers.models.*;
import com.gemstoneseekers.repositories.AssessmentRepository;
import com.gemstoneseekers.repositories.BadgeRepository;
import com.gemstoneseekers.repositories.CandidateBadgeRepository;
import com.gemstoneseekers.repositories.CandidateRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BadgeApplicationServiceTest {

    @InjectMocks
    private BadgeApplicationService badgeApplicationService;

    @Mock
    private BadgeRepository badgeRepository;
    @Mock
    private AssessmentRepository assessmentRepository;
    @Mock
    private CandidateRepository candidateRepository;
    @Mock
    private CandidateBadgeRepository candidateBadgeRepository;
    @Mock
    private CandidateService candidateService;
    @Mock
    private BadgeMapper badgeMapper;

    @Captor
    private ArgumentCaptor<CandidateBadge> candidateBadgeCaptor;

    @Nested
    @DisplayName("evaluateAndAssignBadge")
    class EvaluateAndAssignBadge {

        @Test
        @DisplayName("should do nothing if no badge is found for the technology and difficulty")
        void whenNoBadgeFound_shouldDoNothing() {
            UUID candidateId = UUID.randomUUID();
            Integer technologyId = 1;
            QuestionDifficulty difficulty = QuestionDifficulty.BEGINNER;
            UUID assessmentId = UUID.randomUUID();
            BigDecimal finalScore = new BigDecimal("90.00");

            when(badgeRepository.findByTechnologyIdAndDifficultyLevel(technologyId, difficulty)).thenReturn(Optional.empty());

            badgeApplicationService.evaluateAndAssignBadge(candidateId, technologyId, assessmentId, finalScore, difficulty);
            verify(candidateBadgeRepository, never()).existsByCandidateIdAndBadgeId(any(), any());
            verify(candidateBadgeRepository, never()).save(any());
        }

        @Test
        @DisplayName("should do nothing if score is below minimum")
        void whenScoreIsBelowMinimum_shouldDoNothing() {
            UUID candidateId = UUID.randomUUID();
            Integer technologyId = 1;
            QuestionDifficulty difficulty = QuestionDifficulty.BEGINNER;
            UUID assessmentId = UUID.randomUUID();
            BigDecimal finalScore = new BigDecimal("79.99");

            Badge badge = new Badge();
            badge.setId(10);
            badge.setDifficultyLevel(difficulty);
            badge.setMinimumScore(new BigDecimal("80.00"));

            when(badgeRepository.findByTechnologyIdAndDifficultyLevel(technologyId, difficulty)).thenReturn(Optional.of(badge));

            badgeApplicationService.evaluateAndAssignBadge(candidateId, technologyId, assessmentId, finalScore, difficulty);
            verify(candidateBadgeRepository, never()).existsByCandidateIdAndBadgeId(any(), any());
            verify(candidateBadgeRepository, never()).save(any());
        }

        @Test
        @DisplayName("should do nothing if candidate already has the badge")
        void whenCandidateAlreadyHasBadge_shouldDoNothing() {
            UUID candidateId = UUID.randomUUID();
            Integer technologyId = 1;
            QuestionDifficulty difficulty = QuestionDifficulty.BEGINNER;
            UUID assessmentId = UUID.randomUUID();
            BigDecimal finalScore = new BigDecimal("85.00");

            Badge badge = new Badge();
            badge.setId(10);
            badge.setDifficultyLevel(difficulty);
            badge.setMinimumScore(new BigDecimal("80.00"));

            when(badgeRepository.findByTechnologyIdAndDifficultyLevel(technologyId, difficulty)).thenReturn(Optional.of(badge));
            when(candidateBadgeRepository.existsByCandidateIdAndBadgeId(candidateId, badge.getId())).thenReturn(true);

            badgeApplicationService.evaluateAndAssignBadge(candidateId, technologyId, assessmentId, finalScore, difficulty);
            verify(candidateBadgeRepository, times(1)).existsByCandidateIdAndBadgeId(candidateId, badge.getId());
            verify(candidateRepository, never()).getReferenceById(any());
            verify(assessmentRepository, never()).getReferenceById(any());
            verify(candidateBadgeRepository, never()).save(any());
        }

        @Test
        @DisplayName("should assign badge when all conditions are met")
        void whenAllConditionsMet_shouldAssignBadge() {
            UUID candidateId = UUID.randomUUID();
            Integer technologyId = 1;
            QuestionDifficulty difficulty = QuestionDifficulty.ADVANCED;
            UUID assessmentId = UUID.randomUUID();
            BigDecimal finalScore = new BigDecimal("95.00");

            Badge badge = new Badge();
            badge.setId(10);
            badge.setName("Java Advanced");
            badge.setDifficultyLevel(difficulty);
            badge.setMinimumScore(new BigDecimal("90.00"));

            Candidate candidateProxy = new Candidate();
            candidateProxy.setId(candidateId);
            Assessment assessmentProxy = new Assessment();
            assessmentProxy.setId(assessmentId);

            when(badgeRepository.findByTechnologyIdAndDifficultyLevel(technologyId, difficulty)).thenReturn(Optional.of(badge));
            when(candidateBadgeRepository.existsByCandidateIdAndBadgeId(candidateId, badge.getId())).thenReturn(false);
            when(candidateRepository.getReferenceById(candidateId)).thenReturn(candidateProxy);
            when(assessmentRepository.getReferenceById(assessmentId)).thenReturn(assessmentProxy);

            badgeApplicationService.evaluateAndAssignBadge(candidateId, technologyId, assessmentId, finalScore, difficulty);
            verify(candidateBadgeRepository).save(candidateBadgeCaptor.capture());
            CandidateBadge savedCandidateBadge = candidateBadgeCaptor.getValue();

            assertThat(savedCandidateBadge.getCandidate()).isEqualTo(candidateProxy);
            assertThat(savedCandidateBadge.getBadge()).isEqualTo(badge);
            assertThat(savedCandidateBadge.getAssessment()).isEqualTo(assessmentProxy);
            assertThat(savedCandidateBadge.getId().getCandidateId()).isEqualTo(candidateId);
            assertThat(savedCandidateBadge.getId().getBadgeId()).isEqualTo(badge.getId());
        }
    }

    @Nested
    @DisplayName("getCandidateBadges")
    class GetCandidateBadges {

        @Test
        @DisplayName("should return candidate badges for a valid owner")
        void whenOwnerIsValid_shouldReturnBadges() {
            String email = "owner@test.com";
            UUID candidateId = UUID.randomUUID();

            User user = new User();
            user.setEmail(email);
            Candidate candidate = new Candidate();
            candidate.setId(candidateId);
            candidate.setUser(user);

            List<CandidateBadge> badges = Collections.singletonList(new CandidateBadge());
            List<CandidateBadgeResponse> expectedResponse = Collections.singletonList(new CandidateBadgeResponse("Java", "Java", "Desc", BigDecimal.TEN, null));

            when(candidateService.getCandidateByEmailSession(email)).thenReturn(candidate);
            when(candidateBadgeRepository.findAllByCandidateIdWithDetails(candidateId)).thenReturn(badges);
            when(badgeMapper.toCandidateBadgeListResponse(badges)).thenReturn(expectedResponse);

            List<CandidateBadgeResponse> response = badgeApplicationService.getCandidateBadges(email);

            assertThat(response).isEqualTo(expectedResponse);
            verify(candidateBadgeRepository).findAllByCandidateIdWithDetails(candidateId);
        }

        @Test
        @DisplayName("should throw AccessDeniedException for a non-owner")
        void whenUserIsNotOwner_shouldThrowAccessDenied() {
            String ownerEmail = "owner@test.com";
            String requesterEmail = "requester@test.com";

            User user = new User();
            user.setEmail(ownerEmail);
            Candidate candidate = new Candidate();
            candidate.setUser(user);

            when(candidateService.getCandidateByEmailSession(requesterEmail)).thenReturn(candidate);

            assertThatThrownBy(() -> badgeApplicationService.getCandidateBadges(requesterEmail))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("Operação inválida. Você não é o proprietário deste registro.");
        }
    }

    @Nested
    @DisplayName("getAvailableBadges")
    class GetAvailableBadges {

        @Test
        @DisplayName("should return all available badges")
        void shouldReturnAllAvailableBadges() {
            List<Badge> badges = Collections.singletonList(new Badge());
            List<AvailableBadgeResponse> expectedResponse = Collections.singletonList(new AvailableBadgeResponse(1, "Java", "Java", "Desc", BigDecimal.TEN));

            when(badgeRepository.findAll()).thenReturn(badges);
            when(badgeMapper.toAvailableBadgeListResponse(badges)).thenReturn(expectedResponse);

            List<AvailableBadgeResponse> response = badgeApplicationService.getAvailableBadges();

            assertThat(response).isEqualTo(expectedResponse);
            verify(badgeRepository).findAll();
        }
    }
}
