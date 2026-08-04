package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CandidateProfileResponse;
import com.gemstoneseekers.services.UserProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profile")
public class UserProfileController {

    UserProfileService userProfileService;
    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> getCandidateProfile(@PathVariable UUID userId) {

        CandidateProfileResponse candidateProfile = userProfileService.getCandidateProfileByUserId(userId);

        return ResponseEntity.status(HttpStatus.OK)
            .body( new BaseResponse<>(true,"Candidate profile retrieved successfully", candidateProfile,null ));
    }



}
