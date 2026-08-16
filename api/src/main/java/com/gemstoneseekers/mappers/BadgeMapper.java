package com.gemstoneseekers.mappers;

import com.gemstoneseekers.dtos.response.AvailableBadgeResponse;
import com.gemstoneseekers.dtos.response.CandidateBadgeResponse;
import com.gemstoneseekers.models.Badge;
import com.gemstoneseekers.models.CandidateBadge;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class BadgeMapper {

    public CandidateBadgeResponse toCandidateBadgeResponse(CandidateBadge candidateBadge) {
        if (candidateBadge == null) {
            return null;
        }
        return new CandidateBadgeResponse(candidateBadge.getBadge().getName(), candidateBadge.getBadge().getTechnology()
                .getName(), candidateBadge.getBadge().getDescription(), candidateBadge.getAssesment().getScore(),
                candidateBadge.getEarnedAt());
    }

    public List<CandidateBadgeResponse> toCandidateBadgeListResponse(List<CandidateBadge> candidateBadgeList) {
        if (candidateBadgeList == null || candidateBadgeList.isEmpty()) {
            return Collections.emptyList();
        }
        return candidateBadgeList.stream().map(this::toCandidateBadgeResponse).toList();
    }

    public AvailableBadgeResponse toAvailableBadgeResponse(Badge badge) {
        if (badge == null) {
            return null;
        }
        return new AvailableBadgeResponse(badge.getId(), badge.getName(), badge.getTechnology().getName(), badge
                .getDescription(), badge.getMinimumScore());
    }

    public List<AvailableBadgeResponse> toAvailableBadgeListResponse(List<Badge> badgeList) {
        if (badgeList == null || badgeList.isEmpty()) {
            return Collections.emptyList();
        }
        return badgeList.stream().map(this::toAvailableBadgeResponse).toList();
    }
}
