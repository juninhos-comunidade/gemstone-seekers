package com.gemstoneseekers.services;

import com.gemstoneseekers.dtos.response.AvailableBadgeResponse;
import com.gemstoneseekers.dtos.response.CandidateBadgeResponse;
import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.exceptions.AccessDeniedException;
import com.gemstoneseekers.mappers.BadgeMapper;
import com.gemstoneseekers.models.Assessment;
import com.gemstoneseekers.models.Badge;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.CandidateBadge;
import com.gemstoneseekers.repositories.BadgeRepository;
import com.gemstoneseekers.repositories.CandidateBadgeRepository;
import com.gemstoneseekers.repositories.CandidateRepository;
import com.gemstoneseekers.repositories.AssessmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class BadgeApplicationService {

    private static final Logger log = LoggerFactory.getLogger(BadgeApplicationService.class);

    private final BadgeRepository badgeRepository;
    private final AssessmentRepository assessmentRepository;
    private final CandidateRepository candidateRepository;
    private final CandidateBadgeRepository candidateBadgeRepository;
    private final CandidateService candidateService;
    private final BadgeMapper badgeMapper;

    public BadgeApplicationService(BadgeRepository badgeRepository, AssessmentRepository assessmentRepository,
            CandidateRepository candidateRepository, CandidateBadgeRepository candidateBadgeRepository,
            CandidateService candidateService, BadgeMapper badgeMapper) {
        this.badgeRepository = badgeRepository;
        this.assessmentRepository = assessmentRepository;
        this.candidateRepository = candidateRepository;
        this.candidateBadgeRepository = candidateBadgeRepository;
        this.candidateService = candidateService;
        this.badgeMapper = badgeMapper;
    }

    @Transactional
    public void evaluateAndAssignBadge(UUID candidateId, Integer technologyId, UUID assesmentId,
            BigDecimal finalScore, QuestionDifficulty difficulty) {
        Badge badge = badgeRepository.findByTechnologyIdAndDifficultyLevel(technologyId, difficulty).orElse(null);

        if (badge == null || finalScore.compareTo(badge.getMinimumScore()) < 0) {
            if (log.isDebugEnabled()) {
                log.debug("[BADGE] Candidate {} did not reach the minimum score or no badge exists for technology {}",
                        candidateId, technologyId);
            }
            return;
        }

        if (candidateBadgeRepository.existsByCandidateIdAndBadgeId(candidateId, badge.getId())) {
            if (log.isInfoEnabled()) {
                log.info("[BADGE] Candidate {} already owns the badge {}. Skipping assignment.", candidateId, badge
                        .getName());
            }
            return;
        }

        Candidate candidateProxy = candidateRepository.getReferenceById(candidateId);
        Assessment assesmentProxy = assessmentRepository.getReferenceById(assesmentId);

        CandidateBadge candidateBadge = new CandidateBadge(candidateProxy, badge, assesmentProxy);
        candidateBadgeRepository.save(candidateBadge);

        if (log.isInfoEnabled()) {
            log.info("[BADGE] Successfully assigned badge {} to candidate {}", badge.getName(), candidateId);
        }
    }

    @Transactional(readOnly = true)
    public List<CandidateBadgeResponse> getCandidateBadges(String email) {
        Candidate candidate = candidateService.getCandidateByEmailSession(email);

        if (!candidate.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new AccessDeniedException("Operação inválida. Você não é o proprietário deste registro.");
        }
        List<CandidateBadge> badges = candidateBadgeRepository.findAllByCandidateIdWithDetails(candidate.getId());

        return badgeMapper.toCandidateBadgeListResponse(badges);
    }

    @Transactional(readOnly = true)
    public List<AvailableBadgeResponse> getAvailableBadges() {
        List<Badge> badges = badgeRepository.findAll();
        return badgeMapper.toAvailableBadgeListResponse(badges);
    }
}
