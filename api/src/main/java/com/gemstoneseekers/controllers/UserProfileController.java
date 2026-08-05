package com.gemstoneseekers.controllers;

import com.gemstoneseekers.dtos.request.UserRequest;
import com.gemstoneseekers.dtos.response.BaseResponse;
import com.gemstoneseekers.dtos.response.CandidateProfileResponse;
import com.gemstoneseekers.dtos.response.UserResponse;
import com.gemstoneseekers.services.UserProfileService;
import com.gemstoneseekers.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profile")
public class UserProfileController {

    private final UserService userService;
    UserProfileService userProfileService;
    public UserProfileController(UserProfileService userProfileService, UserService userService) {
        this.userProfileService = userProfileService;
        this.userService = userService;
    }

    @GetMapping("")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<BaseResponse<CandidateProfileResponse>> getCandidateProfile(
        @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        CandidateProfileResponse candidateProfile = userProfileService.getCandidateProfileByUserEmail(email);

        return ResponseEntity.status(HttpStatus.OK)
            .body( new BaseResponse<>(true,"Candidate profile retrieved successfully", candidateProfile,null ));
    }

    @PatchMapping("/user")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<BaseResponse<UserResponse>> updateCandidateProfile(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestBody UserRequest request)
    {
        String email = userDetails.getUsername();
        UserResponse updatedUser = userService.updateUserByEmail(email,request);

        return ResponseEntity.status(HttpStatus.OK)
            .body( new BaseResponse<>(true,"User info updated successfully", updatedUser,null));
    }



}
