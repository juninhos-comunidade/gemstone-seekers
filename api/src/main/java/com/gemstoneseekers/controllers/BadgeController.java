package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.response.AvailableBadgeResponse;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CandidateBadgeResponse;
import com.gemstoneseekers.services.BadgeApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/badges")
public class BadgeController {

    private final BadgeApplicationService badgeApplicationService;

    private static final String CANDIDATE_ROLE = "hasRole('CANDIDATE')";
    private static final String ANY_AUTH_ROLE = "hasAnyRole('CANDIDATE', 'RECRUITER')";

    public BadgeController(BadgeApplicationService badgeApplicationService) {
        this.badgeApplicationService = badgeApplicationService;
    }

    @GetMapping("/me")
    @PreAuthorize(CANDIDATE_ROLE)
    public ResponseEntity<BaseResponse<List<CandidateBadgeResponse>>> getMyBadges(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        List<CandidateBadgeResponse> response = badgeApplicationService.getCandidateBadges(email);

        return ResponseEntity.ok(new BaseResponse<>(true, "Candidate badges retrieved successfully", response, null));
    }

    @GetMapping("/available")
    @PreAuthorize(ANY_AUTH_ROLE)
    public ResponseEntity<BaseResponse<List<AvailableBadgeResponse>>> getAvailableBadges() {

        List<AvailableBadgeResponse> response = badgeApplicationService.getAvailableBadges();

        return ResponseEntity.ok(new BaseResponse<>(true, "Badge catalog retrieved successfully", response, null));
    }
}
